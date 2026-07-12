from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.event_payment import EventPayment
from app.models.student_event_fee import StudentEventFee
from app.schemas.event_payment import EventPaymentCreate

router = APIRouter(
    prefix="/event-payments",
    tags=["Event Payments"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def add_event_payment(payment: EventPaymentCreate, db: Session = Depends(get_db)):

    fee = db.query(StudentEventFee).filter(
        StudentEventFee.id == payment.student_event_fee_id
    ).first()

    if fee is None:
        raise HTTPException(
            status_code=404,
            detail="Student Event Fee not found"
        )

    if payment.amount_paid > fee.remaining_amount:
        raise HTTPException(
            status_code=400,
            detail=f"Only ₹{fee.remaining_amount} is remaining."
        )

    new_payment = EventPayment(**payment.model_dump())

    db.add(new_payment)

    fee.total_paid += payment.amount_paid
    fee.remaining_amount = fee.event_fee - fee.total_paid

    if fee.remaining_amount == 0:
        fee.status = "Paid"
    elif fee.total_paid == 0:
        fee.status = "Pending"
    else:
        fee.status = "Partially Paid"

    db.commit()
    db.refresh(new_payment)

    return {
        "message": "Event payment added successfully!"
    }


@router.get("/")
def get_event_payments(db: Session = Depends(get_db)):
    return db.query(EventPayment).all()

@router.get("/{student_event_fee_id}")
def get_payment_history(
    student_event_fee_id: int,
    db: Session = Depends(get_db)
):
    payments = (
        db.query(EventPayment)
        .filter(
            EventPayment.student_event_fee_id == student_event_fee_id
        )
        .all()
    )

    return payments