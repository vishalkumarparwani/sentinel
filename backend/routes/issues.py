from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from database import get_db
from models import Issue, User
from routes.auth import get_current_user
from schemas import IssueCreate, IssueOut

router = APIRouter(prefix="/issues", tags=["issues"])


def find_issue(issue_id, user, db):
    issue = (
        db.query(Issue)
        .filter(Issue.id == issue_id, Issue.user_id == user.id)
        .first()
    )
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    return issue


@router.get("/", response_model=list[IssueOut])
def get_issues(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Issue)
        .filter(Issue.user_id == current_user.id)
        .order_by(Issue.id.desc())
        .all()
    )


@router.get("/{issue_id}", response_model=IssueOut)
def get_issue(
    issue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return find_issue(issue_id, current_user, db)


@router.post("/", response_model=IssueOut, status_code=201)
def create_issue(
    new_issue: IssueCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    duplicate = (
        db.query(Issue)
        .filter(Issue.title == new_issue.title, Issue.user_id == current_user.id)
        .first()
    )
    if duplicate:
        raise HTTPException(status_code=400, detail="Issue already exists")

    db_issue = Issue(
        title=new_issue.title,
        description=new_issue.description,
        service=new_issue.service,
        status=new_issue.status,
        severity=new_issue.severity,
        due_date=new_issue.due_date,
        reproduction_steps=new_issue.reproduction_steps,
        user_id=current_user.id,
    )
    try:
        db.add(db_issue)
        db.commit()
        db.refresh(db_issue)
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to save issue")
    return db_issue


@router.put("/{issue_id}", response_model=IssueOut)
def update_issue(
    issue_id: int,
    issue: IssueCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_issue = find_issue(issue_id, current_user, db)

    for key, value in issue.model_dump().items():
        setattr(db_issue, key, value)

    try:
        db.commit()
        db.refresh(db_issue)
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update issue")
    return db_issue


@router.delete("/{issue_id}", status_code=204)
def delete_issue(
    issue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_issue = find_issue(issue_id, current_user, db)

    try:
        db.delete(db_issue)
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete issue")