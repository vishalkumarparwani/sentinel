import os

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL and SUPABASE_KEY must be set")


def new_client():
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def sign_up(email, password):
    return new_client().auth.sign_up({"email": email, "password": password})


def sign_in(email, password):
    return new_client().auth.sign_in_with_password({"email": email, "password": password})


def user_from_token(token):
    return new_client().auth.get_user(token).user