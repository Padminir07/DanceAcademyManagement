from pydantic import BaseModel


class StudentEventFeeCreate(BaseModel):
    student_id: int
    event_id: int
    event_fee: int