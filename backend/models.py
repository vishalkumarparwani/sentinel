from database import Base
from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False)

    theme = Column(String, default="dark")

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
    owner = relationship("User")