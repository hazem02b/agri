@echo off
echo.
echo ===============================================================
echo    REDEMARRAGE DU BACKEND AVEC DATASEEDER
echo ===============================================================
echo.

cd /d C:\Users\HAZEM\agricultural-marketplace-fullstack\backend

echo Etape 1/4: Arret du backend...
taskkill /F /IM java.exe >nul 2>&1
timeout /t 4 >nul
echo   OK Backend arrete
echo.

echo Etape 2/4: Nettoyage de l'ancien build...
if exist target (
    rmdir /s /q target >nul 2>&1
    timeout /t 2 >nul
    echo   OK Dossier target supprime
) else (
    echo   INFO Aucun dossier target a supprimer
)
echo.

echo Etape 3/4: Compilation du backend...
echo   Cela peut prendre 10-20 secondes...
echo.
call mvn clean package -DskipTests
if %ERRORLEVEL% EQU 0 (
    echo.
    echo   OK Compilation reussie!
) else (
    echo.
    echo   ERREUR Compilation echouee!
    pause
)
echo.

echo Etape 4/4: Demarrage du backend avec DataSeeder...
echo   Cela peut prendre 30-60 secondes...
echo.
echo   Recherchez ces messages dans les logs:
echo     - Clearing existing data...
echo     - Existing data cleared.
echo     - Seeding database with demo data...
echo     - Database seeded successfully!
echo     - Farmer: farmer@test.com / password123
echo     - Customer 1: customer1@test.com / password123
echo     - Customer 2: customer2@test.com / password123
echo.
echo   Demarrage en cours...
echo.
echo ===============================================================
echo.

java -jar target\marketplace-1.0.0.jar

echo.
echo ===============================================================
echo    BACKEND ARRETE
echo ===============================================================
echo.
pause
