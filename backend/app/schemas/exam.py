from datetime import date
from pydantic import BaseModel


class ExamCreate(BaseModel):
    exam_name: str
    exam_date: date
    exam_fee: int
    remarks: str


class ExamUpdate(BaseModel):
    exam_name: str
    exam_date: date
    exam_fee: int
    remarks: str