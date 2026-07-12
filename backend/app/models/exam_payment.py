from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship

from app.database.database import Base


class ExamPayment(Base):
    __tablename__ = "exam_payments"

    id = Column(Integer, primary_key=True, index=True)

    student_exam_fee_id = Column(Integer, ForeignKey("student_exam_fees.id"))

    amount_paid = Column(Integer)
    payment_date = Column(Date)
    payment_mode = Column(String)
    remarks = Column(String)

    student_exam_fee = relationship("StudentExamFee")