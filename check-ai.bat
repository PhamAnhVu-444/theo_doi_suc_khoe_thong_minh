@echo off
title AI System Health Check
echo ========================================
echo    AI SYSTEM HEALTH CHECK
echo ========================================
echo.

echo Checking Ollama...
tasklist | find "ollama.exe" >nul
if %errorlevel% == 0 (
    echo ✅ Ollama is running
) else (
    echo ❌ Ollama not found - Starting...
    start "Ollama" /MIN cmd /c "ollama serve"
)

echo.
echo Checking Node.js Server...
tasklist | find "node.exe" >nul
if %errorlevel% == 0 (
    echo ✅ Node.js Server is running
) else (
    echo ❌ Node.js Server not found - Starting...
    cd /d "C:\Users\asus\Documents\WED_KNTN"
    start "Node Server" /MIN cmd /c "node ollama-server.js"
)

echo.
echo Checking API Connection...
curl -s http://localhost:3001/api/status >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ API is responding
) else (
    echo ❌ API not responding - Restarting services...
    taskkill /f /im ollama.exe >nul 2>&1
    taskkill /f /im node.exe >nul 2>&1
    timeout /t 3 >nul
    start "Ollama" /MIN cmd /c "ollama serve"
    timeout /t 3 >nul
    cd /d "C:\Users\asus\Documents\WED_KNTN"
    start "Node Server" /MIN cmd /c "node ollama-server.js"
)

echo.
echo ========================================
echo     HEALTH CHECK COMPLETE!
echo ========================================
pause
