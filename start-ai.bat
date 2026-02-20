@echo off
title AI Health System
echo ========================================
echo    AI HEALTH SYSTEM - AUTO START
echo ========================================
echo.
echo Starting Ollama AI Service...
start "Ollama" /MIN cmd /c "ollama serve && pause"
echo Ollama started!
timeout /t 3 /nobreak >nul

echo Starting Node.js Server...
cd /d "C:\Users\asus\Documents\WED_KNTN"
start "Node Server" /MIN cmd /c "node ollama-server.js && pause"
echo Node.js Server started!
timeout /t 3 /nobreak >nul

echo ========================================
echo     AI SYSTEM IS RUNNING!
echo ========================================
echo.
echo Opening web browser...
start http://localhost:3000
timeout /t 2 /nobreak >nul
exit
