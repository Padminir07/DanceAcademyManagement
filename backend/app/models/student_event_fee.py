from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database.database import Base


class StudentEventFee(Base):
    __tablename__ = "student_event_fees"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(Integer, ForeignKey("students.id"))
    event_id = Column(Integer, ForeignKey("events.id"))

    event_fee = Column(Integer)

    total_paid = Column(Integer, default=0)
    remaining_amount = Column(Integer)

    status = Column(String)

    student = relationship("Student")
    event = relationship("Event")