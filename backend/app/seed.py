from datetime import datetime, timedelta
from sqlmodel import Session
from .database import engine, init_db
from .models import Student, Interaction, Communication, Note, Task, StudentStatus

init_db()
now = datetime.utcnow()

students = [
    Student(name="Ava Li", email="ava@example.com", phone="+1-555-1111", grade="12", country="US",
            status=StudentStatus.EXPLORING, last_active_at=now - timedelta(days=2),
            ai_questions_count=6, uploaded_docs_count=1),
    Student(name="Rohan Singh", email="rohan@example.com", phone="+91-555-2222", grade="11", country="IN",
            status=StudentStatus.SHORTLISTING, last_active_at=now - timedelta(days=10),
            ai_questions_count=2, uploaded_docs_count=0),
    Student(name="Maya Chen", email="maya@example.com", phone="+65-555-3333", grade="12", country="SG",
            status=StudentStatus.APPLYING, last_active_at=now - timedelta(days=1),
            ai_questions_count=9, uploaded_docs_count=3),
    Student(name="Diego Garcia", email="diego@example.com", phone="+52-555-4444", grade="12", country="MX",
            status=StudentStatus.SUBMITTED, last_active_at=now - timedelta(days=5),
            ai_questions_count=3, uploaded_docs_count=5),
]

with Session(engine) as session:
    for s in students:
        session.add(s)
    session.commit()

    for s in session.query(Student).all():
        session.add_all([
            Interaction(student_id=s.id, type="login"),
            Interaction(student_id=s.id, type="ai_question", meta="Asked about essay topics"),
        ])
        session.add(Note(student_id=s.id, author="Admin", body="Initial intake complete."))
        session.add(Task(student_id=s.id, title="Follow up on essays", due_at=now + timedelta(days=3)))
        session.add(Communication(student_id=s.id, channel="email", subject="Welcome", body="Welcome to undergraduation!"))
    session.commit()

print("Seeded.")
