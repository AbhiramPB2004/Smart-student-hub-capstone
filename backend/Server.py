from fastapi import FastAPI
from routes.auth_routes import router as auth_router
from routes.students import router as student_router
from routes.admin_students import router as admin_student_router
from routes.platform_super_admins import router as platform_super_admin_router
from routes.platform_admins import router as platform_admins_router
from core.cors import setup_cors
from core.logger import setup_logger

logger = setup_logger("app")
app = FastAPI()
setup_cors(app)

app.include_router(auth_router)
app.include_router(student_router)
app.include_router(admin_student_router)
app.include_router(platform_super_admin_router)
app.include_router(platform_admins_router)


