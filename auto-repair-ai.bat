@echo off
title AI Auto-Repair System
color 0A
echo ========================================
echo    AI AUTO-REPAIR SYSTEM
echo ========================================
echo.
echo [1/5] Checking Ollama processes...
tasklist | findstr "ollama.exe" >nul
if %errorlevel% == 0 (
    echo ✅ Ollama is running
) else (
    echo ❌ Ollama not found - Starting...
    start "Ollama" /MIN cmd /c "ollama serve"
    echo ⏳ Waiting for Ollama to start...
    timeout /t 5 /nobreak >nul
)

echo.
echo [2/5] Checking Node.js processes...
tasklist | findstr "node.exe" >nul
if %errorlevel% == 0 (
    echo ✅ Node.js Server is running
) else (
    echo ❌ Node.js Server not found - Starting...
    cd /d "C:\Users\asus\Documents\WED_KNTN"
    start "Node Server" /MIN cmd /c "node ollama-server.js"
    echo ⏳ Waiting for Node.js to start...
    timeout /t 3 /nobreak >nul
)

echo.
echo [3/5] Testing API connection...
curl -s http://localhost:3001/api/status >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ API is responding
) else (
    echo ❌ API not responding - Restarting all services...
    goto :restart_services
)

echo.
echo [4/5] Testing Ollama connection...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Ollama API is responding
) else (
    echo ❌ Ollama API not responding - Restarting...
    goto :restart_services
)

echo.
echo [5/5] Verifying AI model availability...
curl -s http://localhost:3001/api/status | findstr "llama3.1:8b" >nul
if %errorlevel% == 0 (
    echo ✅ AI model is available
) else (
    echo ❌ AI model not found - Pulling model...
    ollama pull llama3.1:8b
    echo ⏳ Model download complete...
)

goto :success

:restart_services
echo.
echo 🔧 RESTARTING ALL SERVICES...
echo Killing existing processes...
taskkill /f /im ollama.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1
echo ⏳ Waiting for processes to terminate...
timeout /t 3 /nobreak >nul

echo Starting fresh Ollama...
start "Ollama" /MIN cmd /c "ollama serve"
timeout /t 5 /nobreak >nul

echo Starting fresh Node.js Server...
cd /d "C:\Users\asus\Documents\WED_KNTN"
start "Node Server" /MIN cmd /c "node ollama-server.js"
timeout /t 3 /nobreak >nul

echo.
echo 🔍 VERIFYING RESTART...
curl -s http://localhost:3001/api/status >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Services restarted successfully
) else (
    echo ❌ Restart failed - Manual intervention required
    goto :manual_help
)

:success
echo.
echo ========================================
echo     ✅ AI SYSTEM IS HEALTHY!
echo ========================================
echo.
echo 🌐 Web App: http://localhost:3000
echo 🤖 AI Status: Ready
echo 📊 Monitoring: Active
echo.
echo Opening web application...
start http://localhost:3000
timeout /t 2 /nobreak >nul
goto :end

:manual_help
echo.
echo ========================================
echo     ❌ MANUAL HELP REQUIRED
echo ========================================
echo.
echo Please run these commands manually:
echo 1. ollama serve
echo 2. cd C:\Users\asus\Documents\WED_KNTN
echo 3. node ollama-server.js
echo.
pause

:end
echo.
echo AI Auto-Repair Complete!
timeout /t 2 /nobreak >nul
exit
