@echo off
REM Script de démarrage pour Windows (CMD)

echo ============================================
echo   Agricultural Marketplace Platform
echo   Script de Demarrage
echo ============================================
echo.

REM Vérifier Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js n'est pas installe
    pause
    exit /b 1
)

REM Démarrer le frontend
echo Demarrage du Frontend Angular...
cd C:\Users\HAZEM\agricultural-marketplace-fullstack\frontend
start "Angular Frontend" cmd /k "npm start"

echo.
echo ============================================
echo   Frontend demarre!
echo   URL: http://localhost:4200
echo ============================================
echo.
echo Pour demarrer le backend, installez:
echo   - Java 17
echo   - Maven
echo   - MongoDB
echo.
echo Consultez INSTALLATION_GUIDE.md
echo.
pause
