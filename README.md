# Sentinel

**Service-to-Issue v2.2**

Sentinel is an issue-tracking platform built around a simple idea: bugs and problems should be tied to the service they affect, and getting from a raw bug report to a structured, actionable issue should take seconds, not minutes. Sentinel pairs a clean issue-tracking core with an AI triage engine that reads raw text — customer emails, Slack messages, stack traces — and turns it into a properly structured issue, ready to review and save.

## Features

- **Issue tracking** — create, edit, delete, and filter issues by status (Planning / In Progress / Done), search across title, service, priority, and severity
- **Services view** — issues grouped by the service they affect, with open and critical issue counts per service, click-through to inspect any service's issues
- **AI Issue Triage** — paste a raw bug report and get back a structured issue (title, service, priority, severity, reproduction steps) extracted by an LLM, with a review step before saving
- **Authentication** — JWT-based register/login, protected routes on the frontend
- **Dashboard** — live stats computed from real issue data (total, critical, open, services affected), recent issues list, deep-work timer
- **Search & highlight** — search issues from the navbar and jump straight to the matching row, highlighted on arrival

## Tech Stack

**Frontend**
- React + Vite
- React Router
- Tailwind CSS
- lucide-react (icons)
- Context API for global auth state

**Backend**
- FastAPI
- SQLAlchemy + PostgreSQL
- Pydantic (schemas/validation)
- passlib (bcrypt password hashing)
- python-jose (JWT)
- Groq API running Llama 3.3 70B for AI triage

**Infrastructure**
- Docker + Docker Compose (frontend, backend, and db as separate services)
- Uvicorn with hot-reload for local development

## Project Structure

```
sentinel/
├── backend/
│   ├── main.py              # FastAPI app, router registration, CORS, exception handling
│   ├── database.py          # DB engine/session setup
│   ├── models.py            # SQLAlchemy models (User, Issue)
│   ├── schemas.py           # Pydantic request/response schemas
│   ├── auth.py              # Password hashing + JWT encode/decode helpers
│   ├── ai_triage.py         # Groq/Llama integration for issue extraction
│   └── routes/
│       ├── auth.py          # /auth/register, /auth/login, get_current_user
│       ├── users.py         # /users/theme
│       ├── issues.py        # /issues CRUD
│       ├── services.py      # /services (issues grouped by service)
│       └── triage.py        # /triage (AI extraction endpoint)
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Auth/        # Login, Register
│       │   ├── Dashboard/   # Dashboard, DashboardCard, UpcomingIssues, Pomodoro
│       │   ├── Issues/      # Issues, IssueRow, IssueForm
│       │   ├── Services/    # Services
│       │   └── Triage/      # Triage
│       ├── components/      # SearchBar, Sidebar, Navbar
│       ├── context/         # AuthContext
│       ├── layouts/         # MainLayout
│       └── api.js           # Backend API client
└── docker-compose.yml
```

## Getting Started

### Prerequisites
- Docker and Docker Compose installed
- A Groq API key (for AI Triage)

### Environment Variables

Create a `.env` file in `backend/`:

```
SECRET_KEY=your-jwt-secret-key
GROQ_API_KEY=your-groq-api-key
```

### Run with Docker

```bash
docker compose up --build
```

For Local PC:
- Frontend: http://localhost:5173
- Backend: http://127.0.0.1:8000

On first run, register an account at `/register` — all routes except Login/Register require authentication.

### Rebuilding after changes

- Frontend-only changes: hot-reloads automatically, no rebuild needed
- Backend Python file changes: `docker compose up --build`
- Database schema changes: `docker compose down -v` then `docker compose up --build` (wipes existing data)

## AI Triage

The Triage page accepts raw, unstructured text and extracts a structured issue using Groq's hosted Llama 3.3 70B model. If the input doesn't describe an actual bug or problem, the model returns a neutral "no issue" result instead of fabricating one. Extracted issues can be reviewed and edited before being saved to the Issues list.

## Roadmap / Known Limitations

- Services are derived from the free-text `service` field on issues rather than a dedicated `Service` model — inconsistent naming (e.g. "Auth" vs "Authentication") can fragment grouping
- Backend routes are not yet protected with authentication middleware — only the frontend UI is gated
