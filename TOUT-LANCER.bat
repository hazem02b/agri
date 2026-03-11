@echo off
chcp 65001 >nul
color 0A
title LANCEMENT COMPLET - Agricultural Marketplace

echo.
echo ═══════════════════════════════════════════════════════════════
echo    🚀 LANCEMENT COMPLET DU BACKEND AVEC DATASEEDER            
echo ═══════════════════════════════════════════════════════════════
echo.
echo   Ce script va:
echo   1. Arreter tous les processus Java
echo   2. Compiler le backend
echo   3. Demarrer le backend avec DataSeeder
echo   4. Verifier que tout fonctionne
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
pause

REM ═══════════════════════════════════════════════════════════════
REM ÉTAPE 1: Arrêter Java
REM ═══════════════════════════════════════════════════════════════
echo.
echo [1/5] Arret de tous les processus Java...
taskkill /F /IM java.exe >nul 2>&1
timeout /t 4 >nul
echo       ✓ Processus Java arretes
echo.

REM ═══════════════════════════════════════════════════════════════
REM ÉTAPE 2: Navigation
REM ═══════════════════════════════════════════════════════════════
echo [2/5] Navigation vers le dossier backend...
cd /d C:\Users\HAZEM\agricultural-marketplace-fullstack\backend
echo       ✓ Dossier: %CD%
echo.

REM ═══════════════════════════════════════════════════════════════
REM ÉTAPE 3: Nettoyage
REM ═══════════════════════════════════════════════════════════════
echo [3/5] Nettoyage de l'ancien build...
if exist target (
    rmdir /s /q target 2>nul
    timeout /t 2 >nul
    echo       ✓ Ancien build supprime
) else (
    echo       ⓘ Pas d'ancien build
)
echo.

REM ═══════════════════════════════════════════════════════════════
REM ÉTAPE 4: Compilation
REM ═══════════════════════════════════════════════════════════════
echo [4/5] Compilation du backend avec DataSeeder modifie...
echo       ⏳ Cela peut prendre 20-30 secondes...
echo.
call mvn clean package -DskipTests
echo.
if %ERRORLEVEL% EQU 0 (
    echo       ✓ Compilation reussie!
    echo.
) else (
    echo       ✗ ERREUR de compilation!
    echo.
    echo ═══════════════════════════════════════════════════════════════
    echo    ❌ ERREUR - Impossible de compiler le backend
    echo ═══════════════════════════════════════════════════════════════
    echo.
    pause
    exit /b 1
)

REM ═══════════════════════════════════════════════════════════════
REM ÉTAPE 5: Démarrage
REM ═══════════════════════════════════════════════════════════════
echo [5/5] Demarrage du backend...
echo.
echo ═══════════════════════════════════════════════════════════════
echo    ⚠️  MESSAGES IMPORTANTS A RECHERCHER:
echo ═══════════════════════════════════════════════════════════════
echo.
echo    🗑️  Clearing existing data...
echo    ✅ Existing data cleared.
echo    🌱 Seeding database with demo data...
echo    ✅ Database seeded successfully!
echo.
echo    📧 Farmer: farmer@test.com / password123
echo    📧 Customer 1: customer1@test.com / password123
echo    📧 Customer 2: customer2@test.com / password123
echo.
echo ═══════════════════════════════════════════════════════════════
echo    ⚠️  QUAND VOUS VOYEZ CES MESSAGES:
echo ═══════════════════════════════════════════════════════════════
echo.
echo    1. Le backend fonctionne!
echo    2. Les donnees de test sont creees!
echo    3. Vous pouvez ouvrir un nouveau terminal
echo    4. Et lancer: LANCER-TESTS.bat
echo.
echo    ⚠️  NE FERMEZ PAS CETTE FENETRE!
echo    Le backend doit rester ouvert.
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

java -jar target\marketplace-1.0.0.jar

echo.
echo.
echo ═══════════════════════════════════════════════════════════════
echo    ⚠️  Backend arrete
echo ═══════════════════════════════════════════════════════════════
echo.
pause
