import json

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from database import get_db
from models import Conversation, Message, User
from schemas import (
    AIMessageCreate,
    AIModelOut,
    ConversationCreate,
    ConversationRename,
)
from routes.auth import get_current_user
from ai_triage_groq import stream_chat

router = APIRouter(prefix="/ai", tags=["ai"])


@router.get("/models", response_model=list[AIModelOut])
def get_models(
    current_user: User = Depends(get_current_user),
):
    return [
        {
            "provider": "groq",
            "provider_name": "Groq",
            "model": "openai/gpt-oss-120b",
            "display_name": "GPT-OSS 120B",
            "status": "available",
            "capabilities": {
                "text": True,
                "vision": False,
                "files": False,
            },
        }
    ]


@router.get("/conversations")
def get_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversations = (
        db.query(Conversation)
        .filter(Conversation.user_id == current_user.id)
        .order_by(
            Conversation.updated_at.desc(),
            Conversation.created_at.desc(),
        )
        .all()
    )
    return [
        {
            "id": conversation.id,
            "title": conversation.title,
            "created_at": conversation.created_at,
            "updated_at": conversation.updated_at,
        }
        for conversation in conversations
    ]


@router.post("/conversations")
def create_conversation(
    data: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversation = Conversation(
        user_id=current_user.id,
        title=data.title.strip() or "New Chat",
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    return {
        "id": conversation.id,
        "title": conversation.title,
        "created_at": conversation.created_at,
        "updated_at": conversation.updated_at,
    }


@router.get("/conversations/{conversation_id}")
def get_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id,
        )
        .first()
    )
    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    return {
        "conversation": {
            "id": conversation.id,
            "title": conversation.title,
            "created_at": conversation.created_at,
            "updated_at": conversation.updated_at,
        },
        "messages": [
            {
                "id": message.id,
                "conversation_id": conversation.id,
                "role": message.role,
                "content": message.content,
                "created_at": message.created_at,
            }
            for message in conversation.messages
        ],
    }


@router.patch("/conversations/{conversation_id}")
def rename_conversation(
    conversation_id: int,
    data: ConversationRename,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id,
        )
        .first()
    )
    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    title = data.title.strip()

    if not title:
        raise HTTPException(
            status_code=400,
            detail="Title cannot be empty",
        )

    conversation.title = title

    db.commit()
    db.refresh(conversation)

    return {
        "id": conversation.id,
        "title": conversation.title,
        "created_at": conversation.created_at,
        "updated_at": conversation.updated_at,
    }


@router.delete("/conversations/{conversation_id}")
def delete_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id,
        )
        .first()
    )
    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    db.delete(conversation)
    db.commit()

    return {"message": "Conversation deleted"}


@router.post("/conversations/{conversation_id}/messages/stream")
def stream_message(
    conversation_id: int,
    data: AIMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    content = data.content.strip()
    if not content:
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty",
        )

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id,
        )
        .first()
    )

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    user_message = Message(
        conversation_id=conversation.id,
        role="user",
        content=content,
    )

    db.add(user_message)
    db.commit()

    history = (
        db.query(Message)
        .filter(Message.conversation_id == conversation.id)
        .order_by(Message.created_at.asc())
        .all()
    )

    messages = [
        {
            "role": message.role,
            "content": message.content,
        }
        for message in history
    ]

    def generate():
        assistant_content = ""

        try:
            yield f"data: {json.dumps({'type': 'message_start'})}\n\n"

            stream = stream_chat(messages)

            for chunk in stream:
                if not getattr(chunk, "choices", None):
                    continue

                delta = chunk.choices[0].delta.content

                if not delta:
                    continue

                assistant_content += delta

                yield f"data: {json.dumps({'type': 'content', 'content': delta})}\n\n"

            assistant_message = Message(
                conversation_id=conversation.id,
                role="assistant",
                content=assistant_content,
            )

            db.add(assistant_message)

            if conversation.title == "New Chat":
                conversation.title = (
                    content[:60] + "..." if len(content) > 60 else content
                )

            db.commit()

            yield f"data: {json.dumps({'type': 'message_end'})}\n\n"
            yield "data: [DONE]\n\n"

        except Exception as exc:
            db.rollback()

            yield f"data: {json.dumps({'type': 'error', 'error': str(exc)})}\n\n"
            yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )