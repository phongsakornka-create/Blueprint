@echo off
chcp 65001 > nul
title เพิ่มระบบให้เปิดอัตโนมัติเมื่อเปิดคอมพิวเตอร์ (Windows Startup)

set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "SHORTCUT_PATH=%STARTUP_FOLDER%\EngineeringFacultySystem.lnk"
set "TARGET_VBS=%~dp0เริ่มระบบ_ทำงานเบื้องหลัง24ชม_ไม่มีหน้าต่าง.vbs"

powershell -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT_PATH%'); $s.TargetPath = '%TARGET_VBS%'; $s.Save()"

echo ====================================================================
echo ✅ เพิ่มระบบเข้ารายการเริ่มต้นของ Windows สำเร็จเรียบร้อย!
echo.
echo 👉 ต่อไปนี้ ทุกครั้งที่คุณเปิดคอมพิวเตอร์:
echo    ระบบจะเริ่มทำงานเบื้องหลังอัตโนมัติทันที 24 ชม.
echo    โดยไม่มีหน้าต่างสีดำกวนใจ และสามารถเข้าใช้งานได้ตลอดเวลาครับ
echo.
echo (หากต้องการยกเลิก สามารถลบ Shortcut ในโฟลเดอร์ Startup ได้ทุกเมื่อ)
echo ====================================================================
pause
