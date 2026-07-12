from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship

from app.database.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    monthly_fee_id = Column(Integer, ForeignKey("monthly_fees.id"))
    amount_paid = Column(Integer)
    payment_date = Column(Date)
    payment_mode = Column(String)
    remarks = Column(String)

    monthly_fee = relationship("MonthlyFee", back_populates="payments")