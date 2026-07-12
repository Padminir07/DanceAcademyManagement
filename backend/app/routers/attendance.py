from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi import Query
from app.database.database import SessionLocal
from app.models.attendance import Attendance
from app.schemas.attendance import AttendanceCreate, BulkAttendanceCreate
from sqlalchemy import func
from app.models.student import Student
router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def mark_attendance(attendance: AttendanceCreate, db: Session = Depends(get_db)):

    existing = db.query(Attendance).filter(
        Attendance.student_id == attendance.student_id,
        Attendance.attendance_date == attendance.attendance_date
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Attendance already marked for this student today."
        )

    new_attendance = Attendance(**attendance.model_dump())

    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)

    return {
        "message": "Attendance marked successfully!"
    }

@router.post("/bulk")
def mark_bulk_attendance(
    attendance: BulkAttendanceCreate,
    db: Session = Depends(get_db)
):

    for student in attendance.students:

        existing = db.query(Attendance).filter(
            Attendance.student_id == student.student_id,
            Attendance.attendance_date == attendance.attendance_date
        ).first()

        if existing:
            continue

        new_attendance = Attendance(
            student_id=student.student_id,
            attendance_date=attendance.attendance_date,
            status=student.status,
            remarks=student.remarks
        )

        db.add(new_attendance)

    db.commit()

    return {
        "message": "Attendance saved successfully!"
    }
    
@router.get("/")
def get_attendance(
    attendance_date: str = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Attendance)

    if attendance_date:
        query = query.filter(
            Attendance.attendance_date == attendance_date
        )

    return query.all()
@router.get("/summary")
def attendance_summary(
    student_id: int,
    month: int,
    year: int,
    db: Session = Depends(get_db)
):

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    total_classes = db.query(Attendance).filter(
        Attendance.student_id == student_id,
        func.extract("month", Attendance.attendance_date) == month,
        func.extract("year", Attendance.attendance_date) == year
    ).count()

    present = db.query(Attendance).filter(
        Attendance.student_id == student_id,
        Attendance.status == "Present",
        func.extract("month", Attendance.attendance_date) == month,
        func.extract("year", Attendance.attendance_date) == year
    ).count()

    absent = total_classes - present

    percentage = 0

    if total_classes > 0:
        percentage = round((present / total_classes) * 100, 2)

    return {
        "student_name": student.student_name,
        "total_classes": total_classes,
        "present": present,
        "absent": absent,
        "attendance_percentage": percentage
    }