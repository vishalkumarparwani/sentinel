from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr

# ==============================================================================
# Authentication & User Schemas
# ==============================================================================

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    theme: str = "dark"

    class Config:
        from_attributes = True


class UserThemeUpdate(BaseModel):
    theme: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class TokenData(BaseModel):
    user_id: Optional[int] = None


# ==============================================================================
# Service Schemas
# ==============================================================================

class ServiceCreate(BaseModel):
    name: str
    description: Optional[str] = None
    status: str = "active"


class ServiceOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==============================================================================
# Issue Schemas
# ==============================================================================

class IssueCreate(BaseModel):
    title: str
    description: Optional[str] = None
    service: str
    due_date: Optional[datetime] = None
    status: str = "planning"
    completed: bool = False
    severity: Optional[str] = "P3"
    reproduction_steps: Optional[str] = None


class IssueOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    service: str
    due_date: Optional[datetime] = None
    status: str
    completed: bool
    severity: Optional[str] = None
    reproduction_steps: Optional[str] = None
    created_at: datetime
    user_id: Optional[int] = None

    class Config:
        from_attributes = True


# ==============================================================================
# AI Schemas
# ==============================================================================

class AIMessageCreate(BaseModel):
    content: str
    model: str


class AIMessageOut(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationCreate(BaseModel):
    title: str = "New Chat"


class ConversationRename(BaseModel):
    title: str


class ConversationOut(BaseModel):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AIModelCapabilities(BaseModel):
    text: bool = True
    vision: bool = False
    files: bool = False


class AIModelOut(BaseModel):
    provider: str
    provider_name: str
    model: str
    display_name: str
    status: str
    capabilities: AIModelCapabilities