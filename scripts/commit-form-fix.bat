@echo off
echo.
echo ===================================================
echo     Committing Form Validation Fix to Git
echo ===================================================
echo.

echo [1/4] Checking for changes...
git status

echo.
echo [2/4] Adding all changes...
git add .

echo.
echo [3/4] Committing changes...
git commit -m "Fix form validation error in EmployeeForm (TypeError: branch is not a function)"

echo.
echo [4/4] Pushing changes to remote repository...
git push

echo.
echo ===================================================
echo     Form validation fix committed to Git
echo ===================================================