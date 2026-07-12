from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship

from app.database.database import Base


class EventPayment(Base):
    __tablename__ = "event_payments"

    id = Column(Integer, primary_key=True, index=True)

    student_event_fee_id = Column(Integer, ForeignKey("student_event_fees.id"))

    amount_paid = Column(Integer)
    payment_date = Column(Date)
    payment_mode = Column(String)
    remarks = Column(String)

    student_event_fee = relationship("StudentEventFee")