@echo off
chcp 65001 > nul
title Start Engineering Faculty Management System

echo ====================================================================
echo 🚀 กำลังเริ่มการทำงานของระบบคณะวิศวกรรมศาสตร์ (Mobile & Desktop)...
echo ====================================================================

echo [1/2] กำลังเปิด Backend Server (Port 5000)...
start "Backend Server (Port 5000)" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 2 /nobreak > nul

echo [2/2] กำลังเปิด Frontend Web (Port 5173)...
start "Frontend Web (Port 5173)" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 /nobreak > nul

echo.
echo ====================================================================
echo ✨ เปิดระบบสำเร็จเรียบร้อย พร้อมใช้งานทั้งคอมและมือถือ!
echo.
echo 💻 บนคอมพิวเตอร์ เปิดที่:
echo    👉 http://localhost:5173
echo.
echo 📱 บนมือถือ Android และ iPhone (iOS) ที่ต่อ Wi-Fi เดียวกัน เปิดที่:
echo    👉 http://192.168.1.123:5173
echo ====================================================================
start http://localhost:5173

pause
