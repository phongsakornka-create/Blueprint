Set WshShell = CreateObject("WScript.Shell")
strPath = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)

' รัน Backend Server ซ่อนหน้าต่าง (0 = Hide window)
WshShell.Run "cmd /c cd /d """ & strPath & "\backend"" && npm run dev", 0, False

WScript.Sleep 2000

' รัน Frontend Web ซ่อนหน้าต่าง
WshShell.Run "cmd /c cd /d """ & strPath & "\frontend"" && npm run dev", 0, False

WScript.Sleep 3000

' รัน Cloudflare Tunnel ซ่อนหน้าต่าง
WshShell.Run "cmd /c """ & strPath & "\cloudflared.exe"" tunnel --url http://localhost:5173", 0, False

MsgBox "✅ ระบบคณะวิศวกรรมศาสตร์ เริ่มทำงานเบื้องหลังแบบ 24 ชม. เรียบร้อยแล้ว!" & vbCrLf & vbCrLf & "• เปิดใช้งานได้ตลอดเวลาโดยไม่มีหน้าต่างสีดำกวนใจ" & vbCrLf & "• บนคอมพิวเตอร์: http://localhost:5173" & vbCrLf & "• บนมือถือในวง Wi-Fi: http://192.168.1.123:5173" & vbCrLf & vbCrLf & "(หากต้องการปิดระบบ ให้ดับเบิลคลิกไฟล์ หยุดระบบเบื้องหลัง.bat)", vbInformation, "ระบบเริ่มทำงานในเบื้องหลังเรียบร้อย"
