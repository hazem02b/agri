@echo off
chcp 65001 >nul
color 0A
title 🧹 Nettoyage Cache et Relancement

echo.
echo ═══════════════════════════════════════════════════
echo    🧹 NETTOYAGE COMPLET DES CACHES
echo ═══════════════════════════════════════════════════
echo.

echo [1/5] Arrêt des processus...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM esbuild.exe >nul 2>&1
timeout /t 2 >nul
echo ✅ Processus arrêtés

echo.
echo [2/5] Nettoyage cache Angular...
cd frontend
if exist ".angular" rmdir /s /q ".angular" 2>nul
echo ✅ Cache Angular vidé

echo.
echo [3/5] Nettoyage cache node_modules...
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache" 2>nul
echo ✅ Cache node_modules vidé

echo.
echo [4/5] Nettoyage dist...
if exist "dist" rmdir /s /q "dist" 2>nul
echo ✅ Dist supprimé

echo.
echo [5/5] Nettoyage cache npm...
call npm cache clean --force
echo ✅ Cache npm vidé

echo.
echo ═══════════════════════════════════════════════════
echo    ✅ NETTOYAGE TERMINÉ !
echo ═══════════════════════════════════════════════════
echo.
echo 🚀 Démarrage du frontend avec cache vidé...
echo.

start "Frontend Angular" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ✅ Frontend en cours de démarrage dans une nouvelle fenêtre
echo.
echo 📝 Attendez le message: "Compiled successfully"
echo 🌐 Puis ouvrez: http://localhost:4200
echo.
echo 🎯 IMPORTANT: Dans le navigateur, appuyez sur Ctrl+Shift+R
echo    pour forcer le rechargement et vider le cache navigateur
echo.
pause
