# Script de Réinitialisation de la Base de Données
# Date: 10 Mars 2026

Write-Host "`n🔄 RÉINITIALISATION DE LA BASE DE DONNÉES`n" -ForegroundColor Cyan

# Étape 1: Vérifier MongoDB
Write-Host "Étape 1: Vérification de MongoDB..." -ForegroundColor Yellow
$mongo = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
if ($mongo) {
    Write-Host "✅ MongoDB actif (PID: $($mongo.Id))" -ForegroundColor Green
} else {
    Write-Host "❌ MongoDB non démarré!" -ForegroundColor Red
    Write-Host "⚠️ Veuillez démarrer MongoDB avant de continuer" -ForegroundColor Yellow
    exit 1
}

# Étape 2: Arrêter le backend
Write-Host "`nÉtape 2: Arrêt du backend..." -ForegroundColor Yellow
$javaProcesses = Get-Process -Name "java" -ErrorAction SilentlyContinue
if ($javaProcesses) {
    foreach ($proc in $javaProcesses) {
        Write-Host "Arrêt du processus Java (PID: $($proc.Id))..." -ForegroundColor Gray
        try {
            Stop-Process -Id $proc.Id -Force -ErrorAction Stop
        } catch {
            Write-Host "Tentative avec taskkill..." -ForegroundColor Gray
            taskkill /F /PID $proc.Id 2>&1 | Out-Null
        }
    }
    Start-Sleep -Seconds 3
    Write-Host "✅ Backend arrêté" -ForegroundColor Green
} else {
    Write-Host "ℹ️ Aucun backend Java en cours" -ForegroundColor Gray
}

# Étape 3: Supprimer la base de données
Write-Host "`nÉtape 3: Suppression de la base de données..." -ForegroundColor Yellow

# Créer un script MongoDB pour supprimer la base de données
$mongoScript = @"
use agricultural_marketplace
db.dropDatabase()
print('✅ Base de données supprimée')
"@

# Sauvegarder le script temporaire
$mongoScript | Out-File -FilePath ".\temp-drop-db.js" -Encoding UTF8

# Exécuter le script MongoDB
try {
    Write-Host "Connexion à MongoDB..." -ForegroundColor Gray
    $output = & mongosh --quiet --file ".\temp-drop-db.js" 2>&1
    Write-Host "✅ Base de données supprimée avec succès!" -ForegroundColor Green
    Write-Host $output -ForegroundColor Gray
} catch {
    Write-Host "❌ Erreur lors de la suppression: $_" -ForegroundColor Red
    Write-Host "⚠️ Tentative avec la commande mongo (legacy)..." -ForegroundColor Yellow
    try {
        $output = & mongo agricultural_marketplace --eval "db.dropDatabase()" 2>&1
        Write-Host "✅ Base de données supprimée avec succès!" -ForegroundColor Green
        Write-Host $output -ForegroundColor Gray
    } catch {
        Write-Host "❌ Impossible de supprimer la base de données: $_" -ForegroundColor Red
        Write-Host "⚠️ Vous devrez peut-être le faire manuellement avec mongosh ou MongoDB Compass" -ForegroundColor Yellow
    }
}

# Supprimer le fichier temporaire
Remove-Item ".\temp-drop-db.js" -ErrorAction SilentlyContinue

# Étape 4: Redémarrer le backend
Write-Host "`nÉtape 4: Redémarrage du backend avec DataSeeder..." -ForegroundColor Yellow
Write-Host "📂 Navigation vers le dossier backend..." -ForegroundColor Gray
Set-Location C:\Users\HAZEM\agricultural-marketplace-fullstack\backend

Write-Host "🚀 Démarrage du backend..." -ForegroundColor Cyan
Write-Host "⏳ Cela peut prendre 30-60 secondes..." -ForegroundColor Gray
Write-Host "🔍 Recherchez le message '✅ Database seeded successfully!' dans les logs" -ForegroundColor Yellow
Write-Host "`n" -ForegroundColor White

# Lancer le backend
java -jar target\marketplace-1.0.0.jar

Write-Host "`n✅ Script terminé!" -ForegroundColor Green
