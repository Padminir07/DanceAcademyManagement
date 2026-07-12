from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.monthly_fee import MonthlyFee
from app.models.attendance import Attendance
from app.models.student_event_fee import StudentEventFee
from app.models.student_exam_fee import StudentExamFee

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/monthly-fees")
def monthly_fee_report(db: Session = Depends(get_db)):
    return db.query(MonthlyFee).all()


@router.get("/attendance")
def attendance_report(db: Session = Depends(get_db)):
    return db.query(Attendance).all()


@router.get("/event-fees")
def event_fee_report(db: Session = Depends(get_db)):
    return db.query(StudentEventFee).all()


@router.get("/exam-fees")
def exam_fee_report(db: Session = Depends(get_db)):
    return db.query(StudentExamFee).all()