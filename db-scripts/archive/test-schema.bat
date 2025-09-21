@echo off
echo Testing PostgreSQL Schema with psql...

REM Create database if it doesn't exist
psql -U postgres -c "CREATE DATABASE payroll_db WITH ENCODING 'UTF8';" 

REM Run the schema script
psql -U postgres -d payroll_db -f "%~dp0\schema.sql"

echo.
echo If you see no errors above, the schema was created successfully!
echo.
pause