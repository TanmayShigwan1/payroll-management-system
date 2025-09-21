@echo off
echo Deploying schema to Neon PostgreSQL...

REM Make sure to set these environment variables or replace them with your actual values
set PGHOST=%NEON_HOST%
set PGDATABASE=payroll_db
set PGUSER=%NEON_USER%
set PGPASSWORD=%NEON_PASSWORD%
set PGSSLMODE=require

REM Run the simplified schema script against Neon
echo Running schema script...
psql -f "%~dp0\simplified-schema.sql"

echo.
echo If you see no errors above, the schema was deployed successfully to Neon!
echo.
pause