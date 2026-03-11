@echo off
chcp 65001 >nul
color 0B
title Tests API Agricultural Marketplace

echo.
echo ═══════════════════════════════════════════════════════════════
echo             🧪 TESTS API AUTOMATIQUES                          
echo ═══════════════════════════════════════════════════════════════
echo.

cd /d C:\Users\HAZEM\agricultural-marketplace-fullstack

echo [*] Verification du backend...
timeout /t 2 >nul

powershell -NoProfile -ExecutionPolicy Bypass -Command "& { try { $response = Invoke-WebRequest -Uri 'http://localhost:8081/api/products/public/all' -UseBasicParsing -TimeoutSec 5; $content = $response.Content | ConvertFrom-Json; if ($content -is [array]) { $count = $content.Count; Write-Host '    Backend ACTIF - Produits trouves: '$count -ForegroundColor Green } else { Write-Host '    Backend ACTIF mais structure inattendue' -ForegroundColor Yellow } } catch { Write-Host '    Backend NON ACCESSIBLE' -ForegroundColor Red; Write-Host '    Erreur: '$_.Exception.Message -ForegroundColor Red; exit 1 } }"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ═══════════════════════════════════════════════════════════════
    echo   ⚠️  ERREUR: Le backend n'est pas accessible!
    echo ═══════════════════════════════════════════════════════════════
    echo.
    echo   Veuillez:
    echo   1. Verifier que MongoDB est demarre
    echo   2. Lancer START-BACKEND.bat
    echo   3. Attendre que le backend soit completement demarre
    echo   4. Relancer ce script
    echo.
    pause
    exit /b 1
)

echo.
echo [*] Lancement des tests complets...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File ".\test-API.ps1"

echo.
echo ═══════════════════════════════════════════════════════════════
echo   ✅ TESTS TERMINES
echo ═══════════════════════════════════════════════════════════════
echo.
echo   Prochaines etapes:
echo   1. Ouvrir le navigateur: http://localhost:4200
echo   2. Se connecter avec: farmer@test.com / password123
echo   3. Consulter GUIDE_TEST_COMPLET.md pour plus de details
echo.
pause
