@echo off
chcp 65001 > nul
title ปลดล็อค Firewall เพื่อเปิดเว็บในโทรศัพท์มือถือ

:: ตรวจสอบและขอสิทธิ์ Administrator อัตโนมัติ
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo กำลังขอสิทธิ์ Administrator เพื่อปลดล็อคพอร์ต...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo ====================================================================
echo 🔓 กำลังเปิดพอร์ต 5173 (Frontend) และ 5000 (Backend) บน Windows Firewall...
echo ====================================================================

netsh advfirewall firewall delete rule name="Faculty Web App Port 5173" >nul 2>&1
netsh advfirewall firewall delete rule name="Faculty API Port 5000" >nul 2>&1

netsh advfirewall firewall add rule name="Faculty Web App Port 5173" dir=in action=allow protocol=TCP localport=5173 >nul
netsh advfirewall firewall add rule name="Faculty API Port 5000" dir=in action=allow protocol=TCP localport=5000 >nul

echo.
echo ====================================================================
echo ✅ ปลดล็อค Windows Firewall เรียบร้อยแล้ว!
echo 👉 ตอนนี้โทรศัพท์มือถือ (Android / iPhone) สามารถเปิดเข้าเว็บได้แล้วครับ
echo.
echo 📱 ลิงก์สำหรับเปิดในมือถือ:
echo    👉 http://192.168.1.123:5173
echo ====================================================================
echo.
pause
