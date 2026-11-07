from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import Token, UserCreate, UserLogin
from supabase_auth import sign_in, sign_up, user_from_token

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_or_create_profile(supabase_user, db):
    profile = db.query(User).filter(User.id == supabase_user.id).first()
    if profile:
        return profile

    profile = User(id=supabase_user.id, email=supabase_user.email)
    try:
        db.add(profile)
        db.commit()
        db.refresh(profile)
        return profile
    except SQLAlchemyError:
        db.rollback()

    profile = db.query(User).filter(User.id == supabase_user.id).first()
    if not profile:
        raise HTTPException(status_code=500, detail="Failed to load account")
    return profile


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    try:
        supabase_user = user_from_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

    if supabase_user is None:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

    return get_or_create_profile(supabase_user, db)


@router.post("/register", response_model=Token, status_code=201)
def register(data: UserCreate, db: Session = Depends(get_db)):
    try:
        result = sign_up(data.email, data.password)
    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=getattr(error, "message", "Could not create account"),
        )

    if result.user is None or result.session is None:
        raise HTTPException(
            status_code=400,
            detail="Confirm your email, then sign in",
        )

    profile = get_or_create_profile(result.user, db)
    return {
        "access_token": result.session.access_token,
        "token_type": "bearer",
        "user": profile,
    }


@router.post("/login", response_model=Token)
def login(data: UserLogin, db: Session = Depends(get_db)):
    try:
        result = sign_in(data.email, data.password)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    profile = get_or_create_profile(result.user, db)
    return {
        "access_token": result.session.access_token,
        "token_type": "bearer",
        "user": profile,
    }