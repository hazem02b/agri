@echo off
echo.
echo ========================================
echo    REDEMARRAGE COMPLET DU BACKEND
echo ========================================
echo.

echo Etape 1: Arret de tous les processus Java...
taskkill /F /IM java.exe /T >nul 2>&1
timeout /t 3 /nobreak >nul

echo Etape 2: Navigation vers le repertoire backend...
cd /d "%~dp0backend"

echo Etape 3: Nettoyage et compilation...
call mvn clean compile -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: La compilation a echoue!
    pause
    exit /b 1
)

echo.
echo Etape 4: Demarrage du backend...
echo.
echo ============================================
echo   Backend en cours de demarrage...
echo   Port: 8081
echo   Attendez environ 30 secondes
echo ============================================
echo.

start "Backend Server" cmd /k "mvn spring-boot:run"

echo.
echo ✓ Backend demarre dans une nouvelle fenetre
echo   Attendez que vous voyiez "Started MarketplaceApplication"
echo.
pause
