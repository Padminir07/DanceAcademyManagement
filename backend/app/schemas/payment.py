from datetime import date
from pydantic import BaseModel


class PaymentCreate(BaseModel):
    monthly_fee_id: int
    amount_paid: int
    payment_date: date
    payment_mode: str
    remarks: str