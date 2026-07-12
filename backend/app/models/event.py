from sqlalchemy import Column, Integer, String, Date

from app.database.database import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    event_name = Column(String)
    event_date = Column(Date)
    event_fee = Column(Integer)
    location = Column(String)
    remarks = Column(String)