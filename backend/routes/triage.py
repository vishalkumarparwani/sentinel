from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from ai_triage_groq import extract_issue_from_text
from models import User
from routes.auth import get_current_user

router = APIRouter(prefix="/triage", tags=["triage"])


class TriageRequest(BaseModel):
    raw_text: str


@router.post("/")
def run_triage(
    request: TriageRequest,
    current_user: User = Depends(get_current_user),
):
    try:
        return extract_issue_from_text(request.raw_text)
    except Exception:
        raise HTTPException(status_code=500, detail="AI triage failed. Please try again.")