from pydantic import BaseModel


class StudentExamFeeCreate(BaseModel):
    student_id: int
    exam_id: int
    exam_fee: int