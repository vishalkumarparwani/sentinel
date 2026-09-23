from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routes import issues, services, triage, auth, users, ai

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    print("main.py")
    return JSONResponse(
        status_code=500,
        content={"detail": "Something went wrong. Please try again."}
    )


app.include_router(auth.router)
app.include_router(users.router)
# app.include_router(dashboard.router)
app.include_router(issues.router)
app.include_router(services.router)
app.include_router(triage.router)
app.include_router(ai.router)