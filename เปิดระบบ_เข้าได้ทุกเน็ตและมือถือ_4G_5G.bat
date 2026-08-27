@echo off
chcp 65001 > nul
title เปิดระบบคณะวิศวกรรมศาสตร์ (ออนไลน์ เข้าได้ทุกคน ทุกเน็ต 4G/5G)

echo ====================================================================
echo 🚀 กำลังเริ่มการทำงานระบบออนไลน์ (สำหรับส่งให้เพื่อนเข้าใช้งาน)...
echo ====================================================================

echo [1/3] กำลังเปิด Backend Server (Port 5000)...
start "Backend Server" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 2 /nobreak > nul

echo [2/3] กำลังเปิด Frontend Web (Port 5173)...
start "Frontend Web" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 /nobreak > nul

echo [3/3] กำลังสร้างลิงก์ออนไลน์ความเร็วสูง (Cloudflare Tunnel)...
echo.
echo ====================================================================
echo 📌 คำแนะนำ:
echo 1. มองหาบรรทัดที่มีลิงก์ "https://xxxx.trycloudflare.com" ด้านล่างนี้
echo 2. คัดลอกลิงก์นั้น (ที่เป็น https://) ส่งให้เพื่อนทางแชทได้ทันที!
echo ⚠️ (ห้ามส่งลิงก์ 192.168.x.x ให้เพื่อน เพราะนั่นใช้ได้เฉพาะ Wi-Fi บ้านตัวเองเท่านั้น)
echo ====================================================================
echo.

"%~dp0cloudflared.exe" tunnel --url http://localhost:5173

pause
