from datetime import date
from pydantic import BaseModel


class StudentCreate(BaseModel):
    student_name: str
    parent_name: str
    phone: str
    date_of_birth: date
    gender: str
    address: str
    joining_date: date
    monthly_fee: int
    batch: str