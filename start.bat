@echo off
echo ================================================
echo    PAYROLL MANAGEMENT SYSTEM - QUICK START
echo ================================================
echo.

echo [INFO] Starting MySQL Database...
echo Please make sure MySQL is running and database 'payroll_db' exists.
echo.

echo [INFO] Starting Backend (Spring Boot)...
start cmd /k "cd backend && mvn spring-boot:run"
echo Backend will start on http://localhost:8080
echo.

echo [INFO] Waiting 10 seconds for backend to initialize...
timeout /t 10 /nobreak > nul

echo [INFO] Starting Frontend (React)...
start cmd /k "cd frontend && npm start"
echo Frontend will start on http://localhost:3000
echo.

echo ================================================
echo    SETUP COMPLETE!
echo ================================================
echo.
echo Default Login Credentials:
echo Admin: admin / secret123
echo HR:    hr_manager / secret123
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8080
echo.
echo Press any key to exit...
pause > nul
