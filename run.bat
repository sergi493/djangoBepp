@echo off
title Django App Launcher
echo Activando entorno virtual...
call .venv\Scripts\activate.bat

echo Iniciando servidor Django...
start /min cmd /c "python manage.py runserver 127.0.0.1:8000"

:wait
timeout /t 1 >nul
netstat -an | findstr ":8000.*LISTENING" >nul
if %errorlevel% neq 0 goto wait

echo Servidor listo. Abriendo navegador...
start "" http://127.0.0.1:8000/