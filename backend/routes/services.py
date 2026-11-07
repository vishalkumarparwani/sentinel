from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from database import get_db
from models import Issue, User
from routes.auth import get_current_user
from schemas import IssueOut

router = APIRouter(prefix="/services", tags=["services"])


@router.get("/")
def get_services(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        issues = (
            db.query(Issue)
            .filter(Issue.user_id == current_user.id)
            .order_by(Issue.id.desc())
            .all()
        )
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Failed to load services")

    services = {}
    for issue in issues:
        services.setdefault(issue.service, []).append(IssueOut.model_validate(issue))
    return services