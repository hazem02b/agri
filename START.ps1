# 🟢 START.ps1 - Script de démarrage complet
# Agricultural Marketplace Platform

Write-Host "============================================" -ForegroundColor Green
Write-Host "  Agricultural Marketplace Platform       " -ForegroundColor Green  
Write-Host "  Script de Démarrage Automatique         " -ForegroundColor Green
Write-Host "============================================`n" -ForegroundColor Green

# Vérifier les prérequis
Write-Host "📋 Vérification des prérequis...`n" -ForegroundColor Yellow

$prerequisites = @{
    "Java" = "java -version"
    "Maven" = "mvn -version"
    "MongoDB" = "mongod --version"
    "Node.js" = "node --version"
    "npm" = "npm --version"
}

$missing = @()

foreach ($tool in $prerequisites.Keys) {
    try {
        $null = Invoke-Expression $prerequisites[$tool] 2>$null
        Write-Host "  ✅ $tool installé" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ $tool manquant" -ForegroundColor Red
        $missing += $tool
    }
}

if ($missing.Count -gt 0) {
    Write-Host "`n⚠️  Outils manquants: $($missing -join ', ')" -ForegroundColor Red
    Write-Host "📖 Consultez INSTALLATION_GUIDE.md pour les installer" -ForegroundColor Yellow
    Write-Host "`nVoulez-vous continuer avec les outils disponibles? (Y/N)" -ForegroundColor Cyan
    $continue = Read-Host
    if ($continue -ne 'Y' -and $continue -ne 'y') {
        exit
    }
}

Write-Host "`n🚀 Démarrage de la plateforme...`n" -ForegroundColor Cyan

# Fonction pour démarrer un service dans une nouvelle fenêtre
function Start-Service {
    param(
        [string]$Title,
        [string]$Command,
        [string]$Path
    )
    
    $scriptBlock = "Set-Location '$Path'; Write-Host '🔥 Démarrage de $Title' -ForegroundColor Green; $Command; Read-Host 'Appuyez sur Entrée pour fermer'"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $scriptBlock
}

# 1. Démarrer MongoDB (si installé)
if ($missing -notcontains "MongoDB") {
    Write-Host "1️⃣  Démarrage de MongoDB..." -ForegroundColor Cyan
    Start-Service -Title "MongoDB" -Command "mongod --dbpath C:\data\db" -Path "C:\"
    Start-Sleep 3
} else {
    Write-Host "⚠️  MongoDB non installé - Le backend ne pourra pas se connecter" -ForegroundColor Yellow
    Write-Host "   Alternative: Utilisez MongoDB Atlas (gratuit)" -ForegroundColor Yellow
    Write-Host "   https://www.mongodb.com/cloud/atlas/register`n" -ForegroundColor Cyan
}

# 2. Démarrer le Backend Spring Boot (si Maven installé)
if ($missing -notcontains "Maven" -and $missing -notcontains "Java") {
    Write-Host "2️⃣  Démarrage du Backend Spring Boot..." -ForegroundColor Cyan
    $backendPath = "C:\Users\HAZEM\agricultural-marketplace-fullstack\backend"
    Start-Service -Title "Backend Spring Boot" -Command "mvn spring-boot:run" -Path $backendPath
    Start-Sleep 5
} else {
    Write-Host "⚠️  Maven ou Java non installé - Le backend ne démarrera pas" -ForegroundColor Yellow
}

# 3. Démarrer le Frontend Angular
Write-Host "3️⃣  Démarrage du Frontend Angular..." -ForegroundColor Cyan
$frontendPath = "C:\Users\HAZEM\agricultural-marketplace-fullstack\frontend"
Start-Service -Title "Frontend Angular" -Command "npm start" -Path $frontendPath
Start-Sleep 5

Write-Host "`n============================================" -ForegroundColor Green
Write-Host "  ✅ Services démarrés!" -ForegroundColor Green
Write-Host "============================================`n" -ForegroundColor Green

Write-Host "📍 URLs d'accès:`n" -ForegroundColor Cyan
Write-Host "   Frontend:  http://localhost:4200" -ForegroundColor White
Write-Host "   Backend:   http://localhost:8080" -ForegroundColor White
Write-Host "   MongoDB:   mongodb://localhost:27017`n" -ForegroundColor White

Write-Host "📝 Outils de test:`n" -ForegroundColor Cyan
Write-Host "   API Docs:  http://localhost:8080/api" -ForegroundColor White
Write-Host "   MongoDB:   mongosh (dans un terminal)`n" -ForegroundColor White

Write-Host "🔍 Pour arrêter les services:" -ForegroundColor Yellow
Write-Host "   Fermez chaque fenêtre PowerShell ouverte`n" -ForegroundColor White

Write-Host "📖 Documentation:" -ForegroundColor Cyan
Write-Host "   README.md" -ForegroundColor White
Write-Host "   INSTALLATION_GUIDE.md" -ForegroundColor White
Write-Host "   API_DOCUMENTATION.md`n" -ForegroundColor White

Write-Host "Bonne navigation! 🌾" -ForegroundColor Green
Write-Host "`nAppuyez sur Entrée pour fermer ce script..." -ForegroundColor Gray
Read-Host
