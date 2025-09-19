from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import select, Session
from typing import Optional

from .database import init_db, get_session
from .models import Student, Interaction, Communication, Note, Task, StudentStatus

app = FastAPI(title="UG Admin API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

# -------- Students --------
@app.get("/students")
def list_students(
    q: Optional[str] = None,
    status: Optional[str] = None,
    country: Optional[str] = None,
    not_contacted_days: Optional[int] = None,
    high_intent: bool = False,
    session: Session = Depends(get_session),
):
    stmt = select(Student)
    students = session.exec(stmt).all()

    def predicate(s: Student):
        ok = True
        if q:
            ql = q.lower()
            ok &= (ql in s.name.lower() or ql in s.email.lower())
        if status:
            ok &= (s.status == status)
        if country:
            ok &= (s.country == country)
        if not_contacted_days is not None:
            last_comm = session.exec(
                select(Communication)
                .where(Communication.student_id == s.id)
                .order_by(Communication.at.desc())
            ).first()
            if last_comm:
                ok &= (datetime.utcnow() - last_comm.at >= timedelta(days=not_contacted_days))
            else:
                ok &= True  # never contacted qualifies
        if high_intent:
            recent = s.last_active_at and (datetime.utcnow() - s.last_active_at <= timedelta(days=7))
            ok &= (s.ai_questions_count >= 5 or recent or s.status in [StudentStatus.APPLYING, StudentStatus.SUBMITTED])
        return ok

    return [s for s in students if predicate(s)]

@app.get("/students/{student_id}")
def get_student(student_id: int, session: Session = Depends(get_session)):
    s = session.get(Student, student_id)
    if not s:
        raise HTTPException(404, "Student not found")
    interactions = session.exec(select(Interaction).where(Interaction.student_id == student_id).order_by(Interaction.at.desc())).all()
    comms = session.exec(select(Communication).where(Communication.student_id == student_id).order_by(Communication.at.desc())).all()
    notes = session.exec(select(Note).where(Note.student_id == student_id).order_by(Note.at.desc())).all()
    tasks = session.exec(select(Task).where(Task.student_id == student_id)).all()
    return {"student": s, "interactions": interactions, "comms": comms, "notes": notes, "tasks": tasks}

@app.patch("/students/{student_id}")
def update_student(student_id: int, payload: dict, session: Session = Depends(get_session)):
    s = session.get(Student, student_id)
    if not s:
        raise HTTPException(404, "Student not found")
    for k, v in payload.items():
        setattr(s, k, v)
    session.add(s)
    session.commit()
    session.refresh(s)
    return s

# -------- Notes --------
@app.post("/students/{student_id}/notes")
def add_note(student_id: int, body: dict, session: Session = Depends(get_session)):
    note = Note(student_id=student_id, author=body.get("author", "Admin"), body=body.get("body", ""))
    session.add(note)
    session.commit()
    session.refresh(note)
    return note

@app.delete("/notes/{note_id}")
def delete_note(note_id: int, session: Session = Depends(get_session)):
    n = session.get(Note, note_id)
    if not n:
        raise HTTPException(404, "Note not found")
    session.delete(n)
    session.commit()
    return {"ok": True}

# -------- Communications --------
@app.post("/students/{student_id}/comms")
def log_comm(student_id: int, body: dict, session: Session = Depends(get_session)):
    comm = Communication(
        student_id=student_id,
        channel=body.get("channel", "email"),
        subject=body.get("subject"),
        body=body.get("body"),
        direction=body.get("direction", "outbound"),
    )
    session.add(comm)
    session.commit()
    session.refresh(comm)
    return comm

@app.post("/students/{student_id}/trigger-followup")
def trigger_followup(student_id: int, session: Session = Depends(get_session)):
    s = session.get(Student, student_id)
    if not s:
        raise HTTPException(404, "Student not found")
    comm = Communication(
        student_id=student_id,
        channel="email",
        subject="Follow-up sent (mock)",
        body="Hi! Checking in on your applications."
    )
    session.add(comm)
    session.commit()
    return {"ok": True, "message": "Mock follow-up queued"}

# -------- Tasks --------
@app.post("/students/{student_id}/tasks")
def add_task(student_id: int, body: dict, session: Session = Depends(get_session)):
    task = Task(student_id=student_id, title=body.get("title", ""), due_at=body.get("due_at"))
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@app.patch("/tasks/{task_id}")
def update_task(task_id: int, body: dict, session: Session = Depends(get_session)):
    t = session.get(Task, task_id)
    if not t:
        raise HTTPException(404, "Task not found")
    for k, v in body.items():
        setattr(t, k, v)
    session.add(t)
    session.commit()
    session.refresh(t)
    return t

# -------- Insights --------
@app.get("/insights")
def insights(session: Session = Depends(get_session)):
    students = session.exec(select(Student)).all()
    counts = {s.status: 0 for s in [Student(status=StudentStatus.EXPLORING),
                                    Student(status=StudentStatus.SHORTLISTING),
                                    Student(status=StudentStatus.APPLYING),
                                    Student(status=StudentStatus.SUBMITTED)]}
    for s in students:
        counts[s.status] = counts.get(s.status, 0) + 1
    active = sum(1 for s in students if s.last_active_at and (datetime.utcnow() - s.last_active_at <= timedelta(days=7)))
    return {
        "total": len(students),
        "active_7d": active,
        "by_status": counts,
    }
