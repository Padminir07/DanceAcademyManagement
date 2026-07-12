from datetime import date
from pydantic import BaseModel


class AttendanceCreate(BaseModel):
    student_id: int
    attendance_date: date
    status: str
    remarks: str


class AttendanceItem(BaseModel):
    student_id: int
    status: str
    remarks: str = ""


class BulkAttendanceCreate(BaseModel):
    attendance_date: date
    students: list[AttendanceItem]