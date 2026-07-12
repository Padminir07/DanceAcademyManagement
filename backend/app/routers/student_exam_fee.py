from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.student_exam_fee import StudentExamFee
from app.schemas.student_exam_fee import StudentExamFeeCreate

router = APIRouter(
    prefix="/student-exam-fees",
    tags=["Student Exam Fees"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def assign_student_to_exam(
    data: StudentExamFeeCreate,
    db: Session = Depends(get_db)
):

    existing = db.query(StudentExamFee).filter(
        StudentExamFee.student_id == data.student_id,
        StudentExamFee.exam_id == data.exam_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Student is already assigned to this exam."
        )

    assignment = StudentExamFee(
        **data.model_dump(),
        total_paid=0,
        remaining_amount=data.exam_fee,
        status="Pending"
    )

    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return {
        "message": "Student assigned to exam successfully!"
    }


@router.get("/")
def get_student_exam_fees(db: Session = Depends(get_db)):

    fees = db.query(StudentExamFee).all()

    result = []

    for fee in fees:
        result.append({
            "id": fee.id,
            "student_id": fee.student_id,
            "student_name": fee.student.student_name,
            "exam_id": fee.exam_id,
            "exam_name": fee.exam.exam_name,
            "exam_fee": fee.exam_fee,
            "total_paid": fee.total_paid,
            "remaining_amount": fee.remaining_amount,
            "status": fee.status
        })

    return result