from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class StudentStatus:
    EXPLORING = "Exploring"
    SHORTLISTING = "Shortlisting"
    APPLYING = "Applying"
    SUBMITTED = "Submitted"

class Student(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    phone: Optional[str] = None
    grade: Optional[str] = None
    country: Optional[str] = None
    status: str = Field(default=StudentStatus.EXPLORING)
    last_active_at: Optional[datetime] = None
    ai_questions_count: int = 0
    uploaded_docs_count: int = 0

    interactions: List["Interaction"] = Relationship(back_populates="student")
    comms: List["Communication"] = Relationship(back_populates="student")
    notes: List["Note"] = Relationship(back_populates="student")
    tasks: List["Task"] = Relationship(back_populates="student")

class Interaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="student.id")
    at: datetime = Field(default_factory=datetime.utcnow)
    type: str  # login | ai_question | doc_upload | milestone
    meta: Optional[str] = None
    student: Student = Relationship(back_populates="interactions")

class Communication(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="student.id")
    at: datetime = Field(default_factory=datetime.utcnow)
    channel: str  # email | sms | call
    subject: Optional[str] = None
    body: Optional[str] = None
    direction: str = "outbound"  # inbound | outbound
    student: Student = Relationship(back_populates="comms")

class Note(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="student.id")
    at: datetime = Field(default_factory=datetime.utcnow)
    author: str
    body: str
    student: Student = Relationship(back_populates="notes")

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="student.id")
    title: str
    due_at: Optional[datetime] = None
    status: str = "open"  # open | done
    student: Student = Relationship(back_populates="tasks")
