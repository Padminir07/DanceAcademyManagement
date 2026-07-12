from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.exam_payment import ExamPayment
from app.models.student_exam_fee import StudentExamFee
from app.schemas.exam_payment import ExamPaymentCreate

router = APIRouter(
    prefix="/exam-payments",
    tags=["Exam Payments"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def add_exam_payment(
    payment: ExamPaymentCreate,
    db: Session = Depends(get_db)
):

    fee = db.query(StudentExamFee).filter(
        StudentExamFee.id == payment.student_exam_fee_id
    ).first()

    if fee is None:
        raise HTTPException(
            status_code=404,
            detail="Student Exam Fee not found"
        )

    if payment.amount_paid > fee.remaining_amount:
        raise HTTPException(
            status_code=400,
            detail=f"Only ₹{fee.remaining_amount} is remaining."
        )

    new_payment = ExamPayment(
        **payment.model_dump()
    )

    db.add(new_payment)

    fee.total_paid += payment.amount_paid
    fee.remaining_amount = fee.exam_fee - fee.total_paid

    if fee.remaining_amount == 0:
        fee.status = "Paid"
    elif fee.total_paid == 0:
        fee.status = "Pending"
    else:
        fee.status = "Partially Paid"

    db.commit()
    db.refresh(new_payment)

    return {
        "message": "Exam payment added successfully!"
    }


@router.get("/")
def get_exam_payments(
    db: Session = Depends(get_db)
):
    return db.query(ExamPayment).all()


# -----------------------------
# PAYMENT HISTORY (NEW)
# -----------------------------
@router.get("/{student_exam_fee_id}")
def get_exam_payment_history(
    student_exam_fee_id: int,
    db: Session = Depends(get_db)
):
    payments = (
        db.query(ExamPayment)
        .filter(
            ExamPayment.student_exam_fee_id == student_exam_fee_id
        )
        .order_by(ExamPayment.id)
        .all()
    )

    return payments