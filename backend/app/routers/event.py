from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database.database import SessionLocal
from app.models.event import Event
from app.schemas.event import EventCreate, EventUpdate

router = APIRouter(
    prefix="/events",
    tags=["Events"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def add_event(event: EventCreate, db: Session = Depends(get_db)):

    existing = db.query(Event).filter(
        Event.event_name == event.event_name,
        Event.event_date == event.event_date
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Event already exists."
        )

    new_event = Event(**event.model_dump())

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return {
        "message": "Event created successfully!"
    }

@router.put("/{event_id}")
def update_event(
    event_id: int,
    event: EventUpdate,
    db: Session = Depends(get_db)
):
    existing = db.query(Event).filter(
        Event.id == event_id
    ).first()

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    for key, value in event.model_dump().items():
        setattr(existing, key, value)

    db.commit()
    db.refresh(existing)

    return {
        "message": "Event updated successfully!"
    }

from sqlalchemy.exc import IntegrityError

@router.delete("/{event_id}")
def delete_event(
    event_id: int,
    db: Session = Depends(get_db)
):
    event = db.query(Event).filter(
        Event.id == event_id
    ).first()

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    try:
        db.delete(event)
        db.commit()

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Cannot delete event because students are assigned to it."
        )

    return {
        "message": "Event deleted successfully!"
    }

@router.get("/")
def get_events(db: Session = Depends(get_db)):
    return db.query(Event).all()