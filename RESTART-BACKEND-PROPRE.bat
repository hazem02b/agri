@echo off
cls
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║       REDEMARRAGE PROPRE DU BACKEND - NOUVELLE CONFIG       ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [1/4] Arret de tous les processus Java...
taskkill /F /IM java.exe /T >nul 2>&1
timeout /t 3 /nobreak >nul
echo       ✓ Processus Java arretes

echo.
echo [2/4] Navigation vers le repertoire backend...
cd /d "%~dp0backend"
echo       ✓ Dans le repertoire backend

echo.
echo [3/4] Recompilation avec nouvelle configuration de securite...
call mvn clean compile -DskipTests -q
if %ERRORLEVEL% NEQ 0 (
    echo       ✗ ERREUR de compilation!
    pause
    exit /b 1
)
echo       ✓ Compilation reussie

echo.
echo [4/4] Demarrage du backend...
echo.
echo ══════════════════════════════════════════════════════════════
echo    Attendez de voir: "Started MarketplaceApplication"
echo ══════════════════════════════════════════════════════════════
echo.

call mvn spring-boot:run

pause
