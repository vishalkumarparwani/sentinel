from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from database import get_db
from models import Issue
from schemas import IssueCreate, IssueOut

router = APIRouter(prefix="/issues", tags=["issues"])

@router.get("/", response_model=list[IssueOut])
def get_issues(db: Session = Depends(get_db)):
    return db.query(Issue).all()

@router.get("/{issue_id}", response_model=IssueOut)
def get_issue(issue_id: int, db: Session = Depends(get_db)):
    db_issue = db.query(Issue).filter(Issue.id == issue_id).first()

    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    return db_issue

@router.post("/", response_model=IssueOut, status_code=201)
def create_issue(new_issue: IssueCreate, db: Session = Depends(get_db)):
    existing_issue = db.query(Issue).filter(Issue.title == new_issue.title).first()

    if existing_issue is not None:
        raise HTTPException(status_code=400, detail="Issue already exists")

    db_issue = Issue(
        title=new_issue.title,
        service=new_issue.service,
        status=new_issue.status,
        severity=new_issue.severity,
        due_date=new_issue.due_date,
        reproduction_steps=new_issue.reproduction_steps,
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
def update_issue(issue_id: int, issue: IssueCreate, db: Session = Depends(get_db)):
    db_issue = db.query(Issue).filter(Issue.id == issue_id).first()

    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")

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
def delete_issue(issue_id: int, db: Session = Depends(get_db)):
    db_issue = db.query(Issue).filter(Issue.id == issue_id).first()

    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    try:
        db.delete(db_issue)
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete issue")