from pydantic import BaseModel


class MonthlyFeeCreate(BaseModel):
    student_id: int
    year: int
    month: str
    monthly_fee: int
    