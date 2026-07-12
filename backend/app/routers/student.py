from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi import Query
from app.database.database import SessionLocal
from app.models.student import Student
from app.schemas.student import StudentCreate
from app.models.monthly_fee import MonthlyFee
from app.models.payment import Payment
from app.models.attendance import Attendance
from app.models.student_event_fee import StudentEventFee
from app.models.student_exam_fee import StudentExamFee
from app.models.event_payment import EventPayment
from app.models.exam_payment import ExamPayment
router = APIRouter(
    prefix="/students",
    tags=["Students"]
)


# Database Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Add Student
@router.post("/")
def add_student(student: StudentCreate, db: Session = Depends(get_db)):
    new_student = Student(**student.model_dump())

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return {
        "message": "Student added successfully!"
    }


# View All Students
@router.get("/")
def get_students(db: Session = Depends(get_db)):
    students = db.query(Student).all()
    return students

@router.get("/search")
def search_students(
    name: str = Query(None),
    phone: str = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Student)

    if name:
        query = query.filter(Student.student_name.ilike(f"%{name}%"))

    if phone:
        query = query.filter(Student.phone.ilike(f"%{phone}%"))

    return query.all()

@router.get("/by-batch")
def get_students_by_batch(
    batch: str = Query(...),
    db: Session = Depends(get_db)
):
    students = db.query(Student).filter(
        Student.batch == batch
    ).all()

    return students
# Delete Student
@router.delete("/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()

    if student is None:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    # -------------------------
    # Delete Monthly Payments
    # -------------------------
    monthly_fees = db.query(MonthlyFee).filter(
        MonthlyFee.student_id == student_id
    ).all()

    for fee in monthly_fees:
        db.query(Payment).filter(
            Payment.monthly_fee_id == fee.id
        ).delete()

    db.query(MonthlyFee).filter(
        MonthlyFee.student_id == student_id
    ).delete()

    # -------------------------
    # Delete Attendance
    # -------------------------
    db.query(Attendance).filter(
        Attendance.student_id == student_id
    ).delete()

    # -------------------------
    # Delete Event Payments
    # -------------------------
    student_event_fees = db.query(StudentEventFee).filter(
        StudentEventFee.student_id == student_id
    ).all()

    for fee in student_event_fees:
        db.query(EventPayment).filter(
            EventPayment.student_event_fee_id == fee.id
        ).delete()

    db.query(StudentEventFee).filter(
        StudentEventFee.student_id == student_id
    ).delete()

    # -------------------------
    # Delete Exam Payments
    # -------------------------
    student_exam_fees = db.query(StudentExamFee).filter(
        StudentExamFee.student_id == student_id
    ).all()

    for fee in student_exam_fees:
        db.query(ExamPayment).filter(
            ExamPayment.student_exam_fee_id == fee.id
        ).delete()

    # -------------------------
    # Delete Exam Fees
    # -------------------------
    db.query(StudentExamFee).filter(
        StudentExamFee.student_id == student_id
    ).delete()

    # -------------------------
    # Delete Student
    # -------------------------
    db.delete(student)

    db.commit()

    return {
        "message": "Student deleted successfully!"
    }

@router.put("/{student_id}")
def update_student(student_id: int, student: StudentCreate, db: Session = Depends(get_db)):
    existing_student = db.query(Student).filter(Student.id == student_id).first()

    if existing_student is None:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    existing_student.student_name = student.student_name
    existing_student.parent_name = student.parent_name
    existing_student.phone = student.phone
    existing_student.date_of_birth = student.date_of_birth
    existing_student.gender = student.gender
    existing_student.address = student.address
    existing_student.joining_date = student.joining_date
    existing_student.monthly_fee = student.monthly_fee
    existing_student.batch = student.batch
    db.commit()
    db.refresh(existing_student)

    return {
        "message": "Student updated successfully!"
    }