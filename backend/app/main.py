from fastapi import FastAPI
from app.database.database import engine, Base
from app.models.student import Student
from app.routers.student import router as student_router
from app.models.monthly_fee import MonthlyFee
from app.routers.monthly_fee import router as monthly_fee_router
from app.models.payment import Payment
from app.routers.payment import router as payment_router
from app.models.attendance import Attendance
from app.routers.attendance import router as attendance_router
from app.models.event import Event
from app.routers.event import router as event_router
from app.models.student_event_fee import StudentEventFee
from app.routers.student_event_fee import router as student_event_fee_router
from app.models.event_payment import EventPayment
from app.routers.event_payment import router as event_payment_router
from app.routers.dashboard import router as dashboard_router
from app.models.exam import Exam
from app.routers.exam import router as exam_router
from app.models.student_exam_fee import StudentExamFee
from app.routers.report import router as report_router
from app.routers.student_exam_fee import router as student_exam_fee_router
from app.models.exam_payment import ExamPayment
from app.routers.exam_payment import router as exam_payment_router
from app.routers.pending_fee import router as pending_fee_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(
    title="Dance Academy Management API"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://dance-academy-management.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)
app.include_router(student_router)
app.include_router(monthly_fee_router)
app.include_router(payment_router)
app.include_router(attendance_router)
app.include_router(event_router)
app.include_router(student_event_fee_router)
app.include_router(event_payment_router)
app.include_router(dashboard_router)
app.include_router(exam_router)
app.include_router(student_exam_fee_router)
app.include_router(exam_payment_router)
app.include_router(report_router)
app.include_router(pending_fee_router)
@app.get("/")
def home():
    return {
        "message": "Dance Academy Management API is Running 🚀"
    }
