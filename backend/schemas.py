from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from enum import Enum


class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    theme: str

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class UserThemeUpdate(BaseModel):
    theme: str

class IssueStatus(str, Enum):
    planning = "planning"
    in_progress = "in_progress"
    done = "done"

class IssuePriority(str, Enum):
    high = "High"
    medium = "Medium"
    low = "Low"

class IssueSeverity(str, Enum):
    P1 = "P1"
    P2 = "P2"
    P3 = "P3"
    P4 = "P4"

class IssueCreate(BaseModel):
    title: str
    service: str
    priority: IssuePriority = IssuePriority.medium
    status: IssueStatus = IssueStatus.planning
    due_date: date | None = None
    severity: IssueSeverity = IssueSeverity.P3
    reproduction_steps: str | None = None


class IssueUpdate(BaseModel):
    title: str
    service: str
    priority: str
    status: str
    due_date: date | None
    severity: str | None = None
    reproduction_steps: str | None = None


class IssueOut(BaseModel):
    id: int

    title: str
    description: str | None = None
    service: str

    priority: str
    severity: str | None = None
    status: str

    due_date: date | None = None
    reproduction_steps: str | None = None
    created_at: datetime
    user_id: int | None = None

    ai_summary: str | None = None
    ai_priority_reason: str | None = None
    ai_severity_reason: str | None = None
    ai_confidence: float | None = None

    class Config:
        from_attributes = True