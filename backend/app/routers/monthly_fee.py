from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi import Query
from app.database.database import SessionLocal
from app.models.monthly_fee import MonthlyFee
from app.schemas.monthly_fee import MonthlyFeeCreate

from app.models.student import Student
router = APIRouter(
    prefix="/monthly-fees",
    tags=["Monthly Fees"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def add_monthly_fee(fee: MonthlyFeeCreate, db: Session = Depends(get_db)):

    existing_fee = db.query(MonthlyFee).filter(
        MonthlyFee.student_id == fee.student_id,
        MonthlyFee.year == fee.year,
        MonthlyFee.month == fee.month
    ).first()

    if existing_fee:
        raise HTTPException(
            status_code=400,
            detail="Monthly fee for this month already exists."
        )

    new_fee = MonthlyFee(
        **fee.model_dump(),
        total_paid=0,
        remaining_amount=fee.monthly_fee,
        status="Pending"
    )
   

    db.add(new_fee)
    db.commit()
    db.refresh(new_fee)

    return {
        "message": "Monthly fee added successfully!"
    }



@router.get("/")
def get_monthly_fees(
    month: str = Query(None),
    year: int = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(
        MonthlyFee,
        Student.student_name
    ).join(
        Student,
        MonthlyFee.student_id == Student.id
    )

    if month:
        query = query.filter(
            MonthlyFee.month.ilike(f"%{month}%")
        )

    if year:
        query = query.filter(
            MonthlyFee.year == year
        )

    results = query.all()

    return [
        {
            "id": fee.id,
            "student_id": fee.student_id,
            "student_name": student_name,
            "year": fee.year,
            "month": fee.month,
            "monthly_fee": fee.monthly_fee,
            "total_paid": fee.total_paid,
            "remaining_amount": fee.remaining_amount,
            "status": fee.status,
        }
        for fee, student_name in results
    ]
@router.put("/{fee_id}")
def update_monthly_fee(
    fee_id: int,
    fee: MonthlyFeeCreate,
    db: Session = Depends(get_db)
):
    existing_fee = db.query(MonthlyFee).filter(
        MonthlyFee.id == fee_id
    ).first()

    if not existing_fee:
        raise HTTPException(
            status_code=404,
            detail="Monthly Fee not found"
        )

    duplicate = db.query(MonthlyFee).filter(
        MonthlyFee.student_id == fee.student_id,
        MonthlyFee.year == fee.year,
        MonthlyFee.month == fee.month,
        MonthlyFee.id != fee_id
    ).first()

    if duplicate:
        raise HTTPException(
            status_code=400,
            detail="Monthly Fee already exists for this month."
        )

    existing_fee.student_id = fee.student_id
    existing_fee.year = fee.year
    existing_fee.month = fee.month
    existing_fee.monthly_fee = fee.monthly_fee

    existing_fee.remaining_amount = (
        fee.monthly_fee - existing_fee.total_paid
    )

    db.commit()
    db.refresh(existing_fee)

    return {
        "message": "Monthly Fee updated successfully!"
    }
@router.delete("/{fee_id}")
def delete_monthly_fee(
    fee_id: int,
    db: Session = Depends(get_db)
):
    fee = db.query(MonthlyFee).filter(
        MonthlyFee.id == fee_id
    ).first()

    if fee is None:
        raise HTTPException(
            status_code=404,
            detail="Monthly Fee not found"
        )

    db.delete(fee)
    db.commit()

    return {
        "message": "Monthly Fee deleted successfully!"
    }

