from datetime import date
from pydantic import BaseModel


class EventCreate(BaseModel):
    event_name: str
    event_date: date
    event_fee: int
    location: str
    remarks: str


class EventUpdate(BaseModel):
    event_name: str
    event_date: date
    event_fee: int
    location: str
    remarks: str