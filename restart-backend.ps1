# Script de Redémarrage Complet avec DataSeeder
# Date: 10 Mars 2026
# Usage: .\restart-backend.ps1

Write-Host "`n" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   🔄 REDÉMARRAGE DU BACKEND AVEC DATASEEDER" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "`n" -ForegroundColor White

# Étape 1: Arrêter le backend
Write-Host "Étape 1/4: Arrêt du backend..." -ForegroundColor Yellow
$javaProcesses = Get-Process -Name "java" -ErrorAction SilentlyContinue
if ($javaProcesses) {
    Write-Host "  Arrêt des processus Java en cours..." -ForegroundColor Gray
    taskkill /F /IM java.exe 2>&1 | Out-Null
    Start-Sleep -Seconds 4
    $checkJava = Get-Process -Name "java" -ErrorAction SilentlyContinue
    if ($checkJava) {
        Write-Host "  ⚠️ Certains processus Java sont encore actifs" -ForegroundColor Yellow
        Write-Host "  ℹ️ Vous devrez peut-être les arrêter manuellement (Ctrl+C dans le terminal Spring Boot)" -ForegroundColor Gray
        Write-Host "`n" -ForegroundColor White
        Read-Host "Appuyez sur Entrée une fois tous les processus Java arrêtés"
    } else {
        Write-Host "  ✅ Backend arrêté" -ForegroundColor Green
    }
} else {
    Write-Host "  ℹ️ Aucun processus Java à arrêter" -ForegroundColor Gray
}

Write-Host "`n" -ForegroundColor White

# Étape 2: Nettoyer l'ancien build
Write-Host "Étape 2/4: Nettoyage de l'ancien build..." -ForegroundColor Yellow
Set-Location C:\Users\HAZEM\agricultural-marketplace-fullstack\backend
if (Test-Path ".\target") {
    Write-Host "  Suppression du dossier target..." -ForegroundColor Gray
    Remove-Item -Recurse -Force ".\target" -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "  ✅ Dossier target supprimé" -ForegroundColor Green
} else {
    Write-Host "  ℹ️ Aucun dossier target à supprimer" -ForegroundColor Gray
}

Write-Host "`n" -ForegroundColor White

# Étape 3: Compiler le backend
Write-Host "Étape 3/4: Compilation du backend..." -ForegroundColor Yellow
Write-Host "  ⏳ Cela peut prendre 10-20 secondes..." -ForegroundColor Gray
Write-Host "`n" -ForegroundColor White

$compileOutput = mvn clean package -DskipTests 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Compilation réussie!" -ForegroundColor Green
} else {
    Write-Host "  ❌ Erreur de compilation!" -ForegroundColor Red
    Write-Host "`n$compileOutput" -ForegroundColor Red
    Write-Host "`n" -ForegroundColor White
    Read-Host "Appuyez sur Entrée pour continuer malgré l'erreur (ou Ctrl+C pour annuler)"
}

Write-Host "`n" -ForegroundColor White

# Étape 4: Démarrer le backend
Write-Host "Étape 4/4: Démarrage du backend avec DataSeeder..." -ForegroundColor Yellow
Write-Host "  ⏳ Cela peut prendre 30-60 secondes..." -ForegroundColor Gray
Write-Host "`n" -ForegroundColor White
Write-Host "  🔍 Recherchez ces messages dans les logs:" -ForegroundColor Cyan
Write-Host "     • 🗑️ Clearing existing data..." -ForegroundColor White
Write-Host "     • ✅ Existing data cleared." -ForegroundColor White
Write-Host "     • 🌱 Seeding database with demo data..." -ForegroundColor White
Write-Host "     • ✅ Database seeded successfully!" -ForegroundColor White
Write-Host "     • 📧 Farmer: farmer@test.com / password123" -ForegroundColor White
Write-Host "     • 📧 Customer 1: customer1@test.com / password123" -ForegroundColor White
Write-Host "     • 📧 Customer 2: customer2@test.com / password123" -ForegroundColor White
Write-Host "`n" -ForegroundColor White
Write-Host "  🚀 Démarrage en cours..." -ForegroundColor Cyan
Write-Host "`n" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "`n" -ForegroundColor White

# Lancer le backend
java -jar target\marketplace-1.0.0.jar

Write-Host "`n" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   ⚠️ BACKEND ARRÊTÉ" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "`n" -ForegroundColor White
