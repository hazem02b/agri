# 🧪 GUIDE DE TEST DES APIs

## 📋 Comment tester

### Option 1: Script automatique
```bash
Double-cliquez sur: TESTER-APIS.bat
```

### Option 2: Tests manuels dans le navigateur

#### 1. API Statistiques Globales
```
URL: http://localhost:8081/api/stats/global
Méthode: GET
Résultat attendu: JSON avec totalFarmers, totalProducts, totalOrders
```

#### 2. API Produits (Marketplace)
```
URL: http://localhost:8081/api/products
Méthode: GET
Résultat attendu: Liste de produits (JSON array)
```

#### 3. API Authentification
```
URL: http://localhost:8081/api/auth/login
Méthode: POST
Headers: Content-Type: application/json
Body:
{
  "email": "farmer@test.com",
  "password": "password123"
}
Résultat attendu: Token JWT + infos utilisateur
```

#### 4. API Offres d'Emploi
```
URL: http://localhost:8081/api/jobs
Méthode: GET
Résultat attendu: Liste d'offres d'emploi (JSON array)
```

---

## ✅ Ce qui devrait fonctionner MAINTENANT

### APIs Publiques (sans authentification)
- ✅ `GET /api/stats/global` - Statistiques
- ✅ `GET /api/products` - Liste des produits
- ✅ `GET /api/products/{id}` - Détail d'un produit
- ✅ `POST /api/auth/login` - Connexion
- ✅ `POST /api/auth/signup` - Inscription
- ✅ `POST /api/auth/forgot-password` - Mot de passe oublié
- ✅ `GET /api/jobs` - Liste des offres d'emploi

### APIs Protégées (avec token JWT)
- 🔒 `GET /api/orders/my-orders` - Mes commandes
- 🔒 `POST /api/orders` - Créer une commande
- 🔒 `PUT /api/users/profile` - Modifier le profil
- 🔒 `GET /api/farmer/my-products` - Mes produits (agriculteur)
- 🔒 `POST /api/products` - Ajouter un produit (agriculteur)

---

## 🔍 Vérification Rapide

### Backend actif?
```powershell
Test-NetConnection -ComputerName localhost -Port 8081
```

### Frontend actif?
```powershell
Test-NetConnection -ComputerName localhost -Port 4200
```

---

## ❌ Si vous voyez "403 Forbidden"

Cela signifie:
1. Le backend tourne avec l'**ancienne configuration**
2. Vous devez **redémarrer le backend**

**Solution:**
```
1. Double-cliquez sur: REDEMARRER-BACKEND.bat
2. Attendez voir "Started MarketplaceApplication"
3. Lancez: TESTER-APIS.bat
```

---

## 🌐 Test dans le Navigateur

Ouvrez ces URLs directement:

1. http://localhost:8081/api/stats/global
   → Devrait afficher JSON

2. http://localhost:8081/api/products
   → Devrait afficher liste de produits

3. http://localhost:4200
   → Devrait afficher le frontend

---

## 📊 Résultats Attendus

### GET /api/stats/global
```json
{
  "totalFarmers": 1,
  "totalProducts": 10,
  "totalOrders": 3,
  "averageRating": 4.8
}
```

### GET /api/products
```json
[
  {
    "id": "...",
    "name": "Tomates Bio",
    "price": 3.5,
    "category": "VEGETABLES",
    "availableQuantity": 100,
    ...
  },
  ...
]
```

### POST /api/auth/login
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV...",
  "id": "...",
  "email": "farmer@test.com",
  "firstName": "Mohamed",
  "lastName": "Ben Ali",
  "role": "FARMER",
  "farmerProfile": {
    "farmName": "Ferme El Baraka",
    ...
  }
}
```

---

## 🚨 Problèmes Courants

### 1. "Connection refused" ou "Cannot connect"
→ Le backend n'est pas démarré
→ Solution: REDEMARRER-BACKEND.bat

### 2. "403 Forbidden"
→ Le backend utilise l'ancienne config de sécurité
→ Solution: REDEMARRER-BACKEND.bat

### 3. "500 Internal Server Error"
→ Erreur dans le backend
→ Solution: Vérifier les logs du backend

### 4. "404 Not Found"
→ URL incorrecte
→ Solution: Vérifier l'orthographe de l'URL

---

## 📞 URLs Complètes

| Service | URL de base |
|---------|-------------|
| Backend API | http://localhost:8081/api |
| Frontend | http://localhost:4200 |
| Stats publiques | http://localhost:8081/api/stats/global |
| Produits | http://localhost:8081/api/products |
| Auth | http://localhost:8081/api/auth/login |

---

## ✨ Après les Tests

Si **tous les tests passent**, votre système est **100% fonctionnel**!

Vous pouvez:
1. Ouvrir http://localhost:4200
2. Vous connecter avec farmer@test.com / password123
3. Utiliser toutes les fonctionnalités!
