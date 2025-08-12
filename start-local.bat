@echo off
echo 🚀 Starting Payroll Management System...
echo.

echo ⚠️  This script requires:
echo    - Java 17+
echo    - Node.js 16+
echo    - Maven (or use ./mvnw)
echo.

pause

echo 📦 Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo ❌ Frontend dependencies installation failed
    pause
    exit /b 1
)

echo ✅ Frontend dependencies installed

echo 🔄 Starting backend server...
cd ..\backend
start "Backend Server" cmd /k "mvn spring-boot:run -Dspring.profiles.active=dev"

echo ⏳ Waiting 30 seconds for backend to start...
timeout /t 30 /nobreak

echo 🔄 Starting frontend server...
cd ..\frontend
start "Frontend Server" cmd /k "npm start"

echo.
echo 🎉 Servers starting...
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:8080/api
echo.
echo 🔐 Login Credentials:
echo    Admin: admin / secret123
echo    HR: hr_manager / secret123
echo    Employee: john_doe / secret123
echo.
echo 💡 If servers don't start:
echo    1. Check Java and Node.js are installed
echo    2. Run: npm install in frontend folder
echo    3. Run: mvn clean compile in backend folder
echo.

pause
