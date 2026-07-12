from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.student import Student
from app.models.event import Event
from app.models.monthly_fee import MonthlyFee
from app.models.student_event_fee import StudentEventFee
from app.models.attendance import Attendance
from app.models.exam import Exam
router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_dashboard(db: Session = Depends(get_db)):

    total_students = db.query(Student).count()

    total_events = db.query(Event).count()
    total_exams = db.query(Exam).count()
    pending_monthly = (
        db.query(MonthlyFee)
        .filter(MonthlyFee.status != "Paid")
        .count()
    )

    pending_events = (
        db.query(StudentEventFee)
        .filter(StudentEventFee.status != "Paid")
        .count()
    )

    today_attendance = (
        db.query(Attendance)
        .filter(
            Attendance.attendance_date == date.today(),
            Attendance.status == "Present"
        )
        .count()
    )

    return {
    "total_students": total_students,
    "total_events": total_events,
    "total_exams": total_exams,
    "pending_monthly_fees": pending_monthly,
    "pending_event_fees": pending_events,
    "today_attendance": today_attendance
}