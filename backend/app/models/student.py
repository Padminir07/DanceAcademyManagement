from sqlalchemy import Column, Integer, String, Date
from app.database.database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    student_name = Column(String, nullable=False)
    parent_name = Column(String)
    phone = Column(String)
    date_of_birth = Column(Date)
    gender = Column(String)
    address = Column(String)
    joining_date = Column(Date)
    monthly_fee = Column(Integer)
    batch = Column(String, nullable=False)