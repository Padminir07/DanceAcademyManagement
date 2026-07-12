from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import SessionLocal

from app.models.student import Student
from app.models.monthly_fee import MonthlyFee
from app.models.student_event_fee import StudentEventFee
from app.models.student_exam_fee import StudentExamFee
from app.models.event import Event
from app.models.exam import Exam

router = APIRouter(
    prefix="/pending-fees",
    tags=["Pending Fees"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_pending_fee(
    student_name: str,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(
        Student.student_name.ilike(f"%{student_name.strip()}%")
    ).first()

    if not student:
        return {
            "message": "Student not found."
        }

    # Monthly Fees
    monthly_fees = db.query(MonthlyFee).filter(
        MonthlyFee.student_id == student.id,
        MonthlyFee.remaining_amount > 0
    ).all()

    clean_monthly_fees = []
    total_pending = 0

    for fee in monthly_fees:
        clean_monthly_fees.append({
            "month": fee.month,
            "year": fee.year,
            "pending_amount": fee.remaining_amount
        })
        total_pending += fee.remaining_amount

    # Event Fees
    event_fees = []

    student_events = db.query(StudentEventFee).filter(
        StudentEventFee.student_id == student.id,
        StudentEventFee.remaining_amount > 0
    ).all()

    for fee in student_events:

        event = db.query(Event).filter(
            Event.id == fee.event_id
        ).first()

        event_fees.append({
            "event_name": event.event_name,
            "pending_amount": fee.remaining_amount
        })

        total_pending += fee.remaining_amount

    # Exam Fees
    exam_fees = []

    student_exams = db.query(StudentExamFee).filter(
        StudentExamFee.student_id == student.id,
        StudentExamFee.remaining_amount > 0
    ).all()

    for fee in student_exams:

        exam = db.query(Exam).filter(
            Exam.id == fee.exam_id
        ).first()

        exam_fees.append({
            "exam_name": exam.exam_name,
            "pending_amount": fee.remaining_amount
        })

        total_pending += fee.remaining_amount

    return {
        "student_name": student.student_name,
        "monthly_fees": clean_monthly_fees,
        "event_fees": event_fees,
        "exam_fees": exam_fees,
        "total_pending": total_pending
    }