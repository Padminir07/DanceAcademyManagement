from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database.database import Base


class StudentExamFee(Base):
    __tablename__ = "student_exam_fees"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(Integer, ForeignKey("students.id"))
    exam_id = Column(Integer, ForeignKey("exams.id"))

    exam_fee = Column(Integer)

    total_paid = Column(Integer, default=0)
    remaining_amount = Column(Integer)

    status = Column(String)

    student = relationship("Student")
    exam = relationship("Exam")