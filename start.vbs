Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c cd /d ""C:\Users\Lenovo\Desktop\E-Shop"" && node_modules\.bin\vite.cmd --host localhost --port 5173", 0, False
