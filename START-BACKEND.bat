@echo off
chcp 65001 >nul
color 0A
title Redemarrage Backend Agricultural Marketplace

echo.
echo ═══════════════════════════════════════════════════════════════
echo             🚀 REDEMARRAGE DU BACKEND                          
echo ═══════════════════════════════════════════════════════════════
echo.

REM Étape 1: Arrêt des processus Java
echo [1/5] Arret des processus Java...
taskkill /F /IM java.exe >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo       ✓ Processus Java arretes
) else (
    echo       ⓘ Aucun processus Java a arreter
)
timeout /t 3 >nul
echo.

REM Étape 2: Navigation vers le dossier backend
echo [2/5] Navigation vers le dossier backend...
cd /d C:\Users\HAZEM\agricultural-marketplace-fullstack\backend
echo       ✓ Dossier: %CD%
echo.

REM Étape 3: Nettoyage
echo [3/5] Nettoyage de l'ancien build...
if exist target (
    rmdir /s /q target 2>nul
    echo       ✓ Dossier target supprime
) else (
    echo       ⓘ Pas de dossier target
)
timeout /t 2 >nul
echo.

REM Étape 4: Compilation
echo [4/5] Compilation du backend...
echo       ⏳ Cela peut prendre 20-30 secondes...
echo.
call mvn clean package -DskipTests
echo.
if %ERRORLEVEL% EQU 0 (
    echo       ✓ Compilation reussie!
) else (
    echo       ✗ ERREUR de compilation!
    echo.
    pause
    exit /b 1
)
echo.

REM Étape 5: Démarrage
echo [5/5] Demarrage du backend...
echo.
echo ═══════════════════════════════════════════════════════════════
echo   ⚠️  RECHERCHEZ CES MESSAGES DANS LES LOGS:
echo ═══════════════════════════════════════════════════════════════
echo.
echo   🗑️  Clearing existing data...
echo   ✅ Existing data cleared.
echo   🌱 Seeding database with demo data...
echo   ✅ Database seeded successfully!
echo   📧 Farmer: farmer@test.com / password123
echo   📧 Customer 1: customer1@test.com / password123
echo   📧 Customer 2: customer2@test.com / password123
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

java -jar target\marketplace-1.0.0.jar

echo.
echo.
echo ═══════════════════════════════════════════════════════════════
echo   ⚠️  Backend arrete
echo ═══════════════════════════════════════════════════════════════
echo.
pause
