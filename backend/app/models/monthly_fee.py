from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database.database import Base


class MonthlyFee(Base):
    __tablename__ = "monthly_fees"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    year = Column(Integer)
    month = Column(String)
    monthly_fee = Column(Integer)

    total_paid = Column(Integer, default=0)
    remaining_amount = Column(Integer)
    status = Column(String)

    student = relationship("Student")
    payments = relationship("Payment", back_populates="monthly_fee")