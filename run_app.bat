@echo off
echo =======================================================================
echo  SMART INDUSTRIAL PLANT MONITORING & CONTROL SYSTEM (SIP-MCS)
echo  Electronics Design Capstone Project (ME - CHE - EE)
echo =======================================================================
echo.

echo Starting Python Flask REST API Backend on http://127.0.0.1:5000 ...
start "SIP-MCS Backend API" "C:\Users\Sona Jain\python311\python.exe" backend\app.py

timeout /t 2 /nobreak > nul

echo Starting React + Vite Frontend on http://localhost:3000 ...
start "SIP-MCS Frontend UI" cmd /c "npm.cmd run dev"

echo.
echo =======================================================================
echo  Both services launched successfully!
echo  Open your web browser and navigate to: http://localhost:3000
echo =======================================================================
pause
