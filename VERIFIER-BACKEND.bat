@echo off
chcp 65001 >nul
color 0E
title Verification Backend

echo.
echo ═══════════════════════════════════════════════════════════════
echo             🔍 VERIFICATION DU BACKEND                         
echo ═══════════════════════════════════════════════════════════════
echo.

REM Vérifier les processus Java
echo [1/2] Verification des processus Java...
tasklist /FI "IMAGENAME eq java.exe" 2>nul | find /I "java.exe" >nul
if %ERRORLEVEL% EQU 0 (
    echo       ✓ Processus Java detectes
) else (
    echo       ✗ Aucun processus Java
    echo.
    echo       ⚠️  Le backend n'est PAS lance!
    echo.
    goto :notrunning
)

echo.

REM Vérifier le port 8081
echo [2/2] Verification du port 8081...
netstat -ano | find ":8081" | find "LISTENING" >nul
if %ERRORLEVEL% EQU 0 (
    echo       ✓ Port 8081 OUVERT
    echo.
    echo ═══════════════════════════════════════════════════════════════
    echo    ✅ OUI - LE BACKEND EST LANCE!
    echo ═══════════════════════════════════════════════════════════════
    echo.
    goto :checkdata
) else (
    echo       ✗ Port 8081 FERME
    echo.
    echo ═══════════════════════════════════════════════════════════════
    echo    ❌ NON - LE BACKEND N'EST PAS LANCE
    echo ═══════════════════════════════════════════════════════════════
    echo.
    goto :notrunning
)

:checkdata
REM Vérifier les données
echo [3/3] Verification des donnees dans la base...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:8081/api/products/public/all' -UseBasicParsing -TimeoutSec 5; $c = ($r.Content | ConvertFrom-Json); if ($c -is [array]) { $count = $c.Count } else { $count = 0 }; if ($count -gt 0) { Write-Host '       ✓ Produits trouves: '$count -ForegroundColor Green; Write-Host ''; Write-Host '   ✅ Le backend fonctionne avec des donnees!' -ForegroundColor Green } else { Write-Host '       ✗ 0 produits dans la base' -ForegroundColor Red; Write-Host ''; Write-Host '   ⚠️  Base de donnees VIDE!' -ForegroundColor Yellow; Write-Host ''; Write-Host '   Solution:' -ForegroundColor Cyan; Write-Host '   1. Fermez le backend (Ctrl+C dans son terminal)' -ForegroundColor White; Write-Host '   2. Lancez START-BACKEND.bat' -ForegroundColor White; Write-Host '   3. Attendez le message: Database seeded successfully!' -ForegroundColor White } } catch { Write-Host '       ✗ Impossible de contacter le backend' -ForegroundColor Red; Write-Host ''; Write-Host '   Le backend est lance mais ne repond pas' -ForegroundColor Yellow }"
echo.
goto :end

:notrunning
echo   Solution:
echo   → Lancez START-BACKEND.bat pour demarrer le backend
echo.
goto :end

:end
echo ═══════════════════════════════════════════════════════════════
echo.
pause
