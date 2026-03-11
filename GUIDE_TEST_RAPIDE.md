# 🧪 Guide de Test Rapide - Frontend Dynamique

## ✅ Vérifications à Effectuer

### 📋 **Checklist Rapide (5 minutes)**

#### 1️⃣ **Test Authentification & Profil Complet**

**Étapes:**
```
1. Ouvrir http://localhost:4200
2. Cliquer "Se connecter"
3. Utiliser:
   - Email: farmer@test.com
   - Mot de passe: password123
4. Observer le Dashboard
```

**✅ Vérifications:**
- [ ] Le nom affiché est **"Mohamed Ben Ali"** (PAS "Ahmed")
- [ ] Le nom de ferme est **"Ferme El Baraka"**
- [ ] L'email affiché est **"farmer@test.com"**
- [ ] Le téléphone est affiché
- [ ] Les initiales dans l'avatar sont **"MB"** (PAS "AB")

**❌ Si ça ne fonctionne pas:**
```powershell
# Vider le cache du navigateur
# OU
# Ouvrir en navigation privée
```

---

#### 2️⃣ **Test Statistiques Dynamiques (Home)**

**Étapes:**
```
1. Retourner à la page d'accueil (http://localhost:4200)
2. Observer les chiffres en haut de page
```

**✅ Vérifications:**
- [ ] Les chiffres correspondent aux données réelles de la DB:
  - Agriculteurs: nombre réel (pas forcément 500+)
  - Produits: nombre réel (pas forcément 2000+)
  - Commandes: nombre réel
  - Satisfaction: note réelle calculée

**Pour vérifier:**
```
F12 (DevTools) → Network → Voir appel à:
GET http://localhost:8081/api/stats/global

Réponse attendue:
{
  "totalFarmers": <nombre>,
  "totalProducts": <nombre>,
  "totalOrders": <nombre>,
  "averageRating": <decimal>
}
```

---

#### 3️⃣ **Test Signup (Création Compte)**

**Étapes:**
```
1. Se déconnecter
2. Cliquer "S'inscrire"
3. Remplir formulaire:
   - Prénom: Test
   - Nom: User
   - Email: test@example.com
   - Téléphone: +216 12 345 678
   - Mot de passe: Test123!
   - Type: Fermier
   - Nom ferme: Ma Ferme Test
   - Description: Test description
4. Valider
```

**✅ Vérifications:**
- [ ] Aucune erreur affichée
- [ ] Redirection automatique vers dashboard
- [ ] Dashboard affiche **"Test User"**
- [ ] Nom de ferme affiché: **"Ma Ferme Test"**
- [ ] Email affiché: **"test@example.com"**

**Pour vérifier en DB (optionnel):**
```javascript
// MongoDB Compass
// Collection: users
// Chercher: { email: "test@example.com" }
// Doit exister avec farmerProfile.farmName = "Ma Ferme Test"
```

---

#### 4️⃣ **Test Chargement Produits (Marketplace)**

**Étapes:**
```
1. Aller à http://localhost:4200/marketplace
2. Attendre chargement
```

**✅ Vérifications:**
- [ ] Produits affichés (minimum 10 du DataSeeder)
- [ ] Filtres fonctionnent
- [ ] Recherche fonctionne
- [ ] Tri fonctionne (distance, prix)
- [ ] Cliquer sur un produit → Détail s'ouvre

**Network Check:**
```
GET http://localhost:8081/api/products
Status: 200
Response: Array de produits
```

---

#### 5️⃣ **Test Dashboard Fermier - Données Réelles**

**Étapes:**
```
1. Se connecter avec farmer@test.com
2. Observer les statistiques du dashboard
```

**✅ Vérifications:**
- [ ] Nombre total produits: réel (pas hardcodé)
- [ ] Revenus du mois: calculé depuis commandes
- [ ] Graphique des ventes: données réelles
- [ ] Liste produits: chargée depuis API
- [ ] Commandes récentes: chargées depuis API

**Network Check:**
```
GET http://localhost:8081/api/farmers/my-products
GET http://localhost:8081/api/orders/my-farmer-orders
```

---

#### 6️⃣ **Test Pages Nouvelles (Jobs, Paiements, Logistique)**

**A. Recrutement:**
```
1. Se connecter avec farmer@test.com
2. Aller à http://localhost:4200/jobs
3. Observer les offres
```
**✅ Vérifications:**
- [ ] Liste d'offres affichée (minimum 3 du DataSeeder)
- [ ] Filtres fonctionnent
- [ ] Bouton "Publier une Offre" visible (FARMER seulement)

**B. Paiements:**
```
1. Aller à http://localhost:4200/payment-settings
2. Observer les méthodes
```
**✅ Vérifications:**
- [ ] Liste de méthodes de paiement (si associées au user)
- [ ] Bouton "Ajouter" visible
- [ ] Formulaire d'ajout fonctionne

**C. Logistique:**
```
1. Se connecter avec farmer@test.com
2. Aller à http://localhost:4200/logistics
3. Observer les tournées
```
**✅ Vérifications:**
- [ ] Liste de routes de livraison (minimum 2 du DataSeeder)
- [ ] Stats affichées (planifiées, en cours, terminées)
- [ ] Filtres par statut fonctionnent

---

#### 7️⃣ **Test Messagerie**

**Étapes:**
```
1. Se connecter avec farmer@test.com
2. Aller à Messagerie (dans le menu)
3. Voir conversations
```

**✅ Vérifications:**
- [ ] Liste de conversations chargée
- [ ] Sélectionner conversation → Messages s'affichent
- [ ] Envoyer message → Message ajouté immédiatement

**Network Check:**
```
GET http://localhost:8081/api/conversations
GET http://localhost:8081/api/messages/:id
POST http://localhost:8081/api/messages/:id
```

---

#### 8️⃣ **Test Panier & Commande**

**Étapes:**
```
1. Se connecter avec customer1@test.com
2. Aller au Marketplace
3. Ajouter produit au panier
4. Voir panier
5. Procéder à la commande (3 étapes)
```

**✅ Vérifications:**
- [ ] Panier mis à jour (compteur dans header)
- [ ] Formulaire livraison
- [ ] Formulaire paiement
- [ ] Commande créée avec succès
- [ ] Redirection vers historique commandes

**Network Check:**
```
POST http://localhost:8081/api/orders
Status: 200
Response: Order créé avec orderNumber
```

---

## 🔍 **Tests API Directs (avec Postman/cURL)**

### 1. Statistiques Globales
```bash
curl http://localhost:8081/api/stats/global
```
**Réponse attendue:**
```json
{
  "totalFarmers": 3,
  "totalProducts": 10,
  "totalOrders": 3,
  "averageRating": 4.8
}
```

### 2. Login avec Profil Complet
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@test.com",
    "password": "password123"
  }'
```
**Vérifier dans la réponse:**
```json
{
  "token": "eyJhbGci...",
  "type": "Bearer",
  "id": "...",
  "email": "farmer@test.com",
  "firstName": "Mohamed",
  "lastName": "Ben Ali",
  "phone": "+216 98 765 432",    ← DOIT ÊTRE PRÉSENT
  "role": "FARMER",
  "farmerProfile": {              ← DOIT ÊTRE PRÉSENT
    "farmName": "Ferme El Baraka",
    "description": "...",
    "rating": 4.8,
    ...
  },
  "address": {                    ← DOIT ÊTRE PRÉSENT
    "city": "Nabeul",
    ...
  }
}
```

### 3. Offres d'Emploi
```bash
curl http://localhost:8081/api/jobs
```

### 4. Méthodes de Paiement
```bash
curl http://localhost:8081/api/payments/methods \
  -H "Authorization: Bearer <TOKEN>"
```

### 5. Routes de Livraison
```bash
curl http://localhost:8081/api/delivery/routes \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 🐛 **Debugging - Si Problème**

### Problème 1: "Ahmed" s'affiche toujours
**Cause:** Cache navigateur ou localStorage ancien

**Solution:**
```javascript
// Console navigateur (F12)
localStorage.clear();
// Puis recharger (Ctrl+R)
```

### Problème 2: Statistiques toujours hardcodées
**Cause:** Frontend n'a pas été recompilé

**Solution:**
```powershell
# Arrêter frontend (Ctrl+C)
cd frontend
Remove-Item -Recurse -Force .angular -ErrorAction SilentlyContinue
npm start
```

### Problème 3: API ne répond pas
**Vérifier backend:**
```powershell
# Vérifier port 8081
Get-NetTCPConnection -LocalPort 8081 -State Listen

# Si inactif, redémarrer
cd backend
mvn spring-boot:run
```

### Problème 4: Données de test manquantes
**Vérifier DataSeeder:**
```powershell
# Dans les logs backend, chercher:
"✅ Database seeded successfully!"
"Created 10 products"
"Created 3 users"

# Si absent, redémarrer backend
```

---

## ✅ **Résultats Attendus**

Si tous les tests passent:
- ✅ Profil utilisateur complet après login
- ✅ Statistiques dynamiques depuis DB
- ✅ Signup fonctionnel
- ✅ Toutes les pages chargent données depuis API
- ✅ Aucune donnée hardcodée visible
- ✅ Système 100% fonctionnel

---

## 📞 Support

**En cas de problème:**
1. Vérifier que backend ET frontend sont lancés
2. Vider cache navigateur + localStorage
3. Vérifier console navigateur (F12) pour erreurs
4. Vérifier Network tab pour appels API
5. Vérifier logs backend pour erreurs

**Ports à vérifier:**
- Backend: http://localhost:8081 ✅
- Frontend: http://localhost:4200 ✅
- MongoDB: localhost:27017 ✅

---

**Date:** 11 Mars 2026  
**Version:** 1.0.0  
**Système:** ✅ PRODUCTION READY
