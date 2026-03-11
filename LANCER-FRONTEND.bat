@echo off
chcp 65001 >nul
color 0B
title Démarrage Frontend Angular

echo.
echo ═══════════════════════════════════════════════════════════════
echo             🚀 DEMARRAGE DU FRONTEND ANGULAR                   
echo ═══════════════════════════════════════════════════════════════
echo.
echo   Ce script va demarrer le frontend Angular sur le port 4200
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

cd /d C:\Users\HAZEM\agricultural-marketplace-fullstack\frontend

echo [*] Navigation vers le dossier frontend...
echo     %CD%
echo.

echo [*] Demarrage d'Angular...
echo     ⏳ Cela peut prendre 20-30 secondes...
echo.
echo ═══════════════════════════════════════════════════════════════
echo    ⚠️  RECHERCHEZ CE MESSAGE:
echo ═══════════════════════════════════════════════════════════════
echo.
echo    ✅ Compiled successfully
echo    ** Angular Live Development Server is listening on localhost:4200
echo.
echo ═══════════════════════════════════════════════════════════════
echo    ⚠️  QUAND VOUS VOYEZ CE MESSAGE:
echo ═══════════════════════════════════════════════════════════════
echo.
echo    1. Ouvrez votre navigateur
echo    2. Allez sur: http://localhost:4200
echo    3. Connectez-vous avec: farmer@test.com / password123
echo.
echo    ⚠️  NE FERMEZ PAS CETTE FENETRE!
echo    Le frontend doit rester ouvert.
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

npm start

echo.
echo ═══════════════════════════════════════════════════════════════
echo    ⚠️  Frontend arrete
echo ═══════════════════════════════════════════════════════════════
echo.
pause
