@echo off
echo Stopping any process on port 3006...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3006') do (
    taskkill /F /PID %%a 2>nul
)
timeout /t 2 /nobreak >nul
echo Starting backend server...
cd backend
npm start
