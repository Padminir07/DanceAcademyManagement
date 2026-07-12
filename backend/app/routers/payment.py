from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.student import Student
from app.database.database import SessionLocal
from app.models.payment import Payment
from app.models.monthly_fee import MonthlyFee
from app.schemas.payment import PaymentCreate

router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def add_payment(payment: PaymentCreate, db: Session = Depends(get_db)):

    fee = db.query(MonthlyFee).filter(
        MonthlyFee.id == payment.monthly_fee_id
    ).first()

    if fee is None:
        raise HTTPException(
            status_code=404,
            detail="Monthly Fee not found"
        )

    if payment.amount_paid > fee.remaining_amount:
        raise HTTPException(
            status_code=400,
            detail=f"Only ₹{fee.remaining_amount} is remaining."
        )

    new_payment = Payment(**payment.model_dump())

    db.add(new_payment)

    # Update fee details
    fee.total_paid += payment.amount_paid
    fee.remaining_amount = fee.monthly_fee - fee.total_paid

    if fee.remaining_amount == 0:
        fee.status = "Paid"
    elif fee.total_paid == 0:
        fee.status = "Pending"
    else:
        fee.status = "Partially Paid"

    db.commit()
    db.refresh(new_payment)

    return {
        "message": "Payment added successfully!"
    }


@router.get("/")
def get_payments(db: Session = Depends(get_db)):

    results = (
        db.query(
            Payment,
            MonthlyFee.month,
            MonthlyFee.year,
            Student.student_name
        )
        .join(
            MonthlyFee,
            Payment.monthly_fee_id == MonthlyFee.id
        )
        .join(
            Student,
            MonthlyFee.student_id == Student.id
        )
        .all()
    )

    return [
        {
            "id": payment.id,
            "student_name": student_name,
            "month": month,
            "year": year,
            "amount_paid": payment.amount_paid,
            "payment_date": payment.payment_date,
            "payment_mode": payment.payment_mode,
            "remarks": payment.remarks,
        }
        for payment, month, year, student_name in results
    ]


@router.delete("/{payment_id}")
def delete_payment(payment_id: int, db: Session = Depends(get_db)):

    payment = db.query(Payment).filter(
        Payment.id == payment_id
    ).first()

    if payment is None:
        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    fee = db.query(MonthlyFee).filter(
        MonthlyFee.id == payment.monthly_fee_id
    ).first()

    fee.total_paid -= payment.amount_paid
    fee.remaining_amount = fee.monthly_fee - fee.total_paid

    if fee.total_paid == 0:
        fee.status = "Pending"
    elif fee.remaining_amount == 0:
        fee.status = "Paid"
    else:
        fee.status = "Partially Paid"

    db.delete(payment)
    db.commit()

    return {
        "message": "Payment deleted successfully!"
    }