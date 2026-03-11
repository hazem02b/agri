@echo off
chcp 65001 >nul
color 0A
title Vérification Rapide

echo.
echo ═══════════════════════════════════════════════════════════════
echo             🔍 VERIFICATION RAPIDE                             
echo ═══════════════════════════════════════════════════════════════
echo.

echo [*] Test du backend sur http://localhost:8081...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:8081/api/products/public/all' -UseBasicParsing -TimeoutSec 5; $c = $r.Content | ConvertFrom-Json; if ($c -is [array]) { $count = $c.Count } else { $count = 0 }; Write-Host ''; Write-Host '═══════════════════════════════════════════════════════════════' -ForegroundColor Cyan; if ($count -ge 10) { Write-Host '   ✅ TOUT EST PRET!' -ForegroundColor Green; Write-Host '═══════════════════════════════════════════════════════════════' -ForegroundColor Cyan; Write-Host ''; Write-Host '   Backend: ACTIF' -ForegroundColor Green; Write-Host '   Produits: '$count' (OK)' -ForegroundColor Green; Write-Host ''; Write-Host '═══════════════════════════════════════════════════════════════' -ForegroundColor Cyan; Write-Host '   🌐 OUVREZ LE SITE:' -ForegroundColor Cyan; Write-Host '═══════════════════════════════════════════════════════════════' -ForegroundColor Cyan; Write-Host ''; Write-Host '   http://localhost:4200' -ForegroundColor White; Write-Host ''; Write-Host '   🔐 Connectez-vous avec:' -ForegroundColor Yellow; Write-Host ''; Write-Host '   Email:    farmer@test.com' -ForegroundColor White; Write-Host '   Password: password123' -ForegroundColor White; Write-Host ''; Write-Host '   ✅ Vous verrez:' -ForegroundColor Green; Write-Host '      • 10 produits' -ForegroundColor White; Write-Host '      • 3 commandes' -ForegroundColor White; Write-Host '      • Statistiques' -ForegroundColor White; Write-Host '' } elseif ($count -gt 0) { Write-Host '   ⚠️  ATTENTION' -ForegroundColor Yellow; Write-Host '═══════════════════════════════════════════════════════════════' -ForegroundColor Cyan; Write-Host ''; Write-Host '   Backend: ACTIF' -ForegroundColor Green; Write-Host '   Produits: '$count' (attendu: 10)' -ForegroundColor Yellow; Write-Host ''; Write-Host '   Le DataSeeder n''a peut-etre pas termine.' -ForegroundColor Yellow; Write-Host '   Verifiez les logs de TOUT-LANCER.bat' -ForegroundColor Yellow; Write-Host '' } else { Write-Host '   ❌ PROBLEME' -ForegroundColor Red; Write-Host '═══════════════════════════════════════════════════════════════' -ForegroundColor Cyan; Write-Host ''; Write-Host '   Backend: ACTIF' -ForegroundColor Green; Write-Host '   Produits: 0 (BASE VIDE!)' -ForegroundColor Red; Write-Host ''; Write-Host '   Le DataSeeder ne s''est pas execute.' -ForegroundColor Yellow; Write-Host '   Verifiez les logs de TOUT-LANCER.bat' -ForegroundColor Yellow; Write-Host '   Cherchez: Database seeded successfully!' -ForegroundColor Cyan; Write-Host '' } } catch { Write-Host ''; Write-Host '═══════════════════════════════════════════════════════════════' -ForegroundColor Cyan; Write-Host '   ❌ BACKEND NON DEMARRE' -ForegroundColor Red; Write-Host '═══════════════════════════════════════════════════════════════' -ForegroundColor Cyan; Write-Host ''; Write-Host '   Le backend n''est pas accessible sur le port 8081' -ForegroundColor Yellow; Write-Host ''; Write-Host '   Solution:' -ForegroundColor Cyan; Write-Host '   1. Verifiez que TOUT-LANCER.bat est ouvert' -ForegroundColor White; Write-Host '   2. Cherchez le message: Started MarketplaceApplication' -ForegroundColor White; Write-Host '   3. Si absent, relancez TOUT-LANCER.bat' -ForegroundColor White; Write-Host '' }"

echo ═══════════════════════════════════════════════════════════════
echo.
pause
