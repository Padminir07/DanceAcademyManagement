from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database.database import SessionLocal
from app.models.exam import Exam
from app.schemas.exam import ExamCreate, ExamUpdate

router = APIRouter(
    prefix="/exams",
    tags=["Exams"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def add_exam(exam: ExamCreate, db: Session = Depends(get_db)):
    new_exam = Exam(**exam.model_dump())

    db.add(new_exam)
    db.commit()
    db.refresh(new_exam)

    return {
        "message": "Exam created successfully!"
    }

@router.put("/{exam_id}")
def update_exam(
    exam_id: int,
    exam: ExamUpdate,
    db: Session = Depends(get_db)
):
    existing = db.query(Exam).filter(
        Exam.id == exam_id
    ).first()

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Exam not found"
        )

    for key, value in exam.model_dump().items():
        setattr(existing, key, value)

    db.commit()
    db.refresh(existing)

    return {
        "message": "Exam updated successfully!"
    }


@router.delete("/{exam_id}")
def delete_exam(
    exam_id: int,
    db: Session = Depends(get_db)
):
    exam = db.query(Exam).filter(
        Exam.id == exam_id
    ).first()

    if not exam:
        raise HTTPException(
            status_code=404,
            detail="Exam not found"
        )

    try:
        db.delete(exam)
        db.commit()

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Cannot delete exam because students are assigned to it."
        )

    return {
        "message": "Exam deleted successfully!"
    }

@router.get("/")
def get_exams(db: Session = Depends(get_db)):
    return db.query(Exam).all()