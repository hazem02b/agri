# Script de Test Automatique - Agricultural Marketplace
# Date: 10 Mars 2026

Write-Host "`n🧪 SCRIPT DE TEST AUTOMATIQUE`n" -ForegroundColor Cyan

# Fonction pour tester l'API
function Test-API {
    param([string]$url, [string]$name)
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing -TimeoutSec 5
        $data = $response.Content | ConvertFrom-Json
        
        if ($data -is [array]) {
            $count = $data.Count
        } elseif ($data.PSObject.Properties['length']) {
            $count = $data.length
        } else {
            $count = 1
        }
        
        Write-Host "✅ $name : $count élément(s)" -ForegroundColor Green
        return $data
    } catch {
        Write-Host "❌ $name : Erreur - $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "TEST 1: Endpoints Publics (Sans Authentication)" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

# Test produits
$products = Test-API "http://localhost:8081/api/products/public/all" "Produits"

# Test agriculteurs
$farmers = Test-API "http://localhost:8081/api/farmers/public/all" "Agriculteurs"

if ($products -and $products.Count -gt 0) {
    Write-Host "`n📦 Exemple de produit:" -ForegroundColor Cyan
    Write-Host "  Nom: $($products[0].name)" -ForegroundColor White
    Write-Host "  Prix: $($products[0].price) TND" -ForegroundColor White
    Write-Host "  Stock: $($products[0].stock) $($products[0].unit)" -ForegroundColor White
    Write-Host "  Catégorie: $($products[0].category)" -ForegroundColor White
}

if ($farmers -and $farmers.Count -gt 0) {
    Write-Host "`n👨‍🌾 Exemple d'agriculteur:" -ForegroundColor Cyan
    Write-Host "  Nom: $($farmers[0].firstName) $($farmers[0].lastName)" -ForegroundColor White
    Write-Host "  Email: $($farmers[0].email)" -ForegroundColor White
    if ($farmers[0].farmerProfile) {
        Write-Host "  Ferme: $($farmers[0].farmerProfile.farmName)" -ForegroundColor White
    }
}

Write-Host "`n═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "TEST 2: Authentification" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

# Test login
Write-Host "Tentative de connexion: farmer@test.com..." -ForegroundColor Gray
try {
    $loginBody = @{
        email = "farmer@test.com"
        password = "password123"
    } | ConvertTo-Json

    $loginResponse = Invoke-WebRequest -Uri "http://localhost:8081/api/auth/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json" `
        -UseBasicParsing `
        -TimeoutSec 10

    $loginData = $loginResponse.Content | ConvertFrom-Json
    
    if ($loginData.success -and $loginData.data.token) {
        Write-Host "✅ Login réussi!" -ForegroundColor Green
        Write-Host "  User: $($loginData.data.user.firstName) $($loginData.data.user.lastName)" -ForegroundColor White
        Write-Host "  Role: $($loginData.data.user.role)" -ForegroundColor White
        Write-Host "  Token: $($loginData.data.token.Substring(0, 20))..." -ForegroundColor Gray
        
        $token = $loginData.data.token
        
        Write-Host "`n═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host "TEST 3: Endpoints Protégés (Avec JWT)" -ForegroundColor Yellow
        Write-Host "═══════════════════════════════════════════════════════════`n" -ForegroundColor Cyan
        
        # Test mes produits
        try {
            $headers = @{ Authorization = "Bearer $token" }
            $myProductsResponse = Invoke-WebRequest -Uri "http://localhost:8081/api/products/my-products" `
                -Method GET `
                -Headers $headers `
                -UseBasicParsing `
                -TimeoutSec 5
            
            $myProducts = $myProductsResponse.Content | ConvertFrom-Json
            Write-Host "✅ Mes produits (agriculteur): $($myProducts.Count) produit(s)" -ForegroundColor Green
        } catch {
            Write-Host "❌ Mes produits: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        # Test mes commandes (agriculteur)
        try {
            $myOrdersResponse = Invoke-WebRequest -Uri "http://localhost:8081/api/orders/farmer/my-orders" `
                -Method GET `
                -Headers $headers `
                -UseBasicParsing `
                -TimeoutSec 5
            
            $myOrders = $myOrdersResponse.Content | ConvertFrom-Json
            Write-Host "✅ Mes commandes (agriculteur): $($myOrders.Count) commande(s)" -ForegroundColor Green
            
            if ($myOrders.Count -gt 0) {
                Write-Host "`n📋 Exemple de commande:" -ForegroundColor Cyan
                Write-Host "  No: $($myOrders[0].orderNumber)" -ForegroundColor White
                Write-Host "  Montant: $($myOrders[0].totalAmount) TND" -ForegroundColor White
                Write-Host "  Status: $($myOrders[0].status)" -ForegroundColor White
            }
        } catch {
            Write-Host "❌ Mes commandes: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        # Test conversations
        try {
            $convResponse = Invoke-WebRequest -Uri "http://localhost:8081/api/messages/conversations" `
                -Method GET `
                -Headers $headers `
                -UseBasicParsing `
                -TimeoutSec 5
            
            $conversations = $convResponse.Content | ConvertFrom-Json
            Write-Host "✅ Conversations: $($conversations.Count) conversation(s)" -ForegroundColor Green
            
            if ($conversations.Count -gt 0) {
                Write-Host "`n💬 Exemple de conversation:" -ForegroundColor Cyan
                Write-Host "  Avec: $($conversations[0].customerName)" -ForegroundColor White
                Write-Host "  Messages: $($conversations[0].messages.Count)" -ForegroundColor White
            }
        } catch {
            Write-Host "❌ Conversations: $($_.Exception.Message)" -ForegroundColor Red
        }
        
    } else {
        Write-Host "❌ Login échoué: Pas de token reçu" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Login échoué: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "TEST 4: Frontend" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:4200" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Frontend accessible sur http://localhost:4200" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend non accessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "RÉSUMÉ DES TESTS" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

if ($products -and $products.Count -ge 10) {
    Write-Host "✅ Base de données remplie ($($products.Count) produits)" -ForegroundColor Green
} else {
    Write-Host "⚠️  Base de données vide ou incomplète" -ForegroundColor Yellow
    Write-Host "   → Redémarrez le backend pour exécuter le DataSeeder" -ForegroundColor Gray
}

Write-Host "`n🎯 POUR TESTER MANUELLEMENT:" -ForegroundColor Cyan
Write-Host "   1. Ouvrez http://localhost:4200" -ForegroundColor White
Write-Host "   2. Cliquez sur 'Se connecter'" -ForegroundColor White
Write-Host "   3. Email: farmer@test.com" -ForegroundColor Yellow
Write-Host "   4. Password: password123" -ForegroundColor Yellow
Write-Host "   5. Explorez le dashboard agriculteur!`n" -ForegroundColor White
