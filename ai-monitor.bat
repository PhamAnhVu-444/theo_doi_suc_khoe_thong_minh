@echo off
title AI Persistent Monitor
color 0B
echo ========================================
echo    AI PERSISTENT MONITOR
echo ========================================
echo.
echo This will keep AI services running 24/7
echo Press Ctrl+C to stop monitoring
echo.

:monitor_loop
echo [%time%] Checking AI services...

:: Check Ollama
tasklist | findstr "ollama.exe" >nul
if %errorlevel% == 0 (
    echo ✅ Ollama: Running
) else (
    echo ❌ Ollama: Down - Restarting...
    start "Ollama" /MIN cmd /c "ollama serve"
    timeout /t 3 /nobreak >nul
)

:: Check Node.js
tasklist | findstr "node.exe" >nul
if %errorlevel% == 0 (
    echo ✅ Node.js: Running
) else (
    echo ❌ Node.js: Down - Restarting...
    cd /d "C:\Users\asus\Documents\WED_KNTN"
    start "Node Server" /MIN cmd /c "node ollama-server.js"
    timeout /t 3 /nobreak >nul
)

:: Check API
curl -s http://localhost:3001/api/status >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ API: Responding
) else (
    echo ❌ API: Down - Full restart needed...
    call auto-repair-ai.bat
)

echo.
echo Waiting 30 seconds before next check...
timeout /t 30 /nobreak >nul
goto monitor_loop
