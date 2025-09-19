# Undergraduation Admin Dashboard (Tech Task)

A lightweight internal CRM to manage student engagement, applications, communications, notes, and reminders.

## Stack
- Frontend: React (Vite) + Tailwind
- Backend: FastAPI + SQLite (SQLModel)

## Quick Start

### 1) Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Seed the DB (in another shell):
```bash
cd backend
python -m app.seed
```

### 2) Frontend
```bash
cd frontend
npm i
npm run dev
```
Open http://localhost:3000

## Features
- Student directory with filters/search
- Individual profile: info, progress bar, interactions, comm log, notes, tasks
- Quick filters: Not contacted in 7 days, High intent, Needs essay help
- Insights summary: totals and by status
- Mock follow-up email trigger
- Bonus: AI Summary (mock)
