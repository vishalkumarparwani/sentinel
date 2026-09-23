from database import Base
from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False)

    theme = Column(String, default="dark")

    issues = relationship("Issue", back_populates="owner")
    conversations = relationship(
        "Conversation",
        back_populates="user",
        cascade="all, delete-orphan"
    )


class Issue(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)

    description = Column(String, nullable=True)
    service = Column(String, nullable=False)

    due_date = Column(Date)
    status = Column(String, nullable=False, default="planning")
    completed = Column(Boolean, nullable=False, default=False)

    severity = Column(String, nullable=True, default="P3")
    reproduction_steps = Column(String, nullable=True)

    created_at = Column(DateTime, server_default=func.now())

    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="issues")


class Conversation(Base):
    __tablename__ = "ai_conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    title = Column(String, nullable=False, default="New Chat")

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now()
    )

    user = relationship("User", back_populates="conversations")

    messages = relationship(
        "Message",
        back_populates="conversation",
        cascade="all, delete-orphan",
        order_by="Message.created_at"
    )


class Message(Base):
    __tablename__ = "ai_messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(
        Integer,
        ForeignKey("ai_conversations.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)

    created_at = Column(DateTime, server_default=func.now())

    conversation = relationship(
        "Conversation",
        back_populates="messages"
    )