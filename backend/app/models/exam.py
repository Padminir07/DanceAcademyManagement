from sqlalchemy import Column, Integer, String, Date

from app.database.database import Base


class Exam(Base):
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True, index=True)

    exam_name = Column(String)
    exam_date = Column(Date)

    exam_fee = Column(Integer)   # <-- ADD THIS

    remarks = Column(String)