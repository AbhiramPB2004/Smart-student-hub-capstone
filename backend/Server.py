from fastapi import FastAPI
from routes.auth_routes import router as auth_router
from routes.students import router as student_router
from routes.admin_students import router as admin_student_router
from core.cors import setup_cors


app = FastAPI()
setup_cors(app)
app.include_router(auth_router)
app.include_router(student_router)
app.include_router(admin_student_router)




