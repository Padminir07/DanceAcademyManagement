from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.student_event_fee import StudentEventFee
from app.schemas.student_event_fee import StudentEventFeeCreate
from app.models.student import Student
from app.models.event import Event
router = APIRouter(
    prefix="/student-event-fees",
    tags=["Student Event Fees"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def assign_student_to_event(
    data: StudentEventFeeCreate,
    db: Session = Depends(get_db)
):

    existing = db.query(StudentEventFee).filter(
        StudentEventFee.student_id == data.student_id,
        StudentEventFee.event_id == data.event_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Student is already assigned to this event."
        )

    assignment = StudentEventFee(
        **data.model_dump(),
        total_paid=0,
        remaining_amount=data.event_fee,
        status="Pending"
    )

    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return {
        "message": "Student assigned to event successfully!"
    }

@router.get("/")
def get_student_event_fees(db: Session = Depends(get_db)):

    results = (
        db.query(
            StudentEventFee,
            Student.student_name,
            Event.event_name
        )
        .join(
            Student,
            StudentEventFee.student_id == Student.id
        )
        .join(
            Event,
            StudentEventFee.event_id == Event.id
        )
        .all()
    )

    return [
        {
            "id": fee.id,
            "student_id": fee.student_id,
            "student_name": student_name,
            "event_id": fee.event_id,
            "event_name": event_name,
            "event_fee": fee.event_fee,
            "total_paid": fee.total_paid,
            "remaining_amount": fee.remaining_amount,
            "status": fee.status,
        }
        for fee, student_name, event_name in results
    ]