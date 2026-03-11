# 🧪 GUIDE DE TEST COMPLET - Agricultural Marketplace

**Date**: 10 Mars 2026  
**Version**: 1.0.0

---

## 📊 ÉTAT ACTUEL DES SERVICES

✅ **MongoDB**: ACTIF (port 27017)  
✅ **Frontend Angular**: ACTIF (http://localhost:4200)  
✅ **Backend Spring Boot**: ACTIF (http://localhost:8081)  
❌ **Base de données**: VIDE (0 produits)

---

## ⚠️ ACTION REQUISE AVANT DE TESTER

Le **DataSeeder** ne s'est pas encore exécuté. Vous devez **redémarrer le backend** pour créer les données de test.

### 🔄 Étapes de Redémarrage:

1. **Trouvez le terminal** où le backend Java tourne (logs Spring Boot)
2. **Arrêtez le backend**: Appuyez sur `Ctrl+C`
3. **Redémarrez**: 
   ```powershell
   cd backend
   mvn spring-boot:run
   ```
4. **Attendez** ces messages dans la console:
   ```
   🌱 Seeding database with demo data...
   ✅ Database seeded successfully!
   📧 Farmer: farmer@test.com / password123
   📧 Customer 1: customer1@test.com / password123
   📧 Customer 2: customer2@test.com / password123
   ```

---

## 🧪 TESTS AUTOMATIQUES

### Script PowerShell Créé: `test-API.ps1`

**Pour lancer les tests automatiques:**
```powershell
.\test-API.ps1
```

**Ce script teste:**
- ✅ Endpoints publics (produits, agriculteurs)
- ✅ Authentification (login avec farmer@test.com)
- ✅ Endpoints protégés (mes produits, mes commandes)
- ✅ Messagerie (conversations)
- ✅ Accessibilité du frontend

**Résultats attendus:**
```
✅ Produits : 10 élément(s)
✅ Agriculteurs : 1 élément(s)
✅ Login réussi!
✅ Mes produits (agriculteur): 10 produit(s)
✅ Mes commandes (agriculteur): 3 commande(s)
✅ Conversations: 1 conversation(s)
✅ Frontend accessible sur http://localhost:4200
```

---

## 🌐 TESTS MANUELS DANS LE NAVIGATEUR

### Test 1: Connexion Agriculteur 👨‍🌾

1. Ouvrir: http://localhost:4200/auth/login
2. **Email**: `farmer@test.com`
3. **Password**: `password123`
4. Cliquer "Se connecter"

**✅ Résultats attendus:**
- Redirection vers `/farmer-dashboard`
- Voir **10 produits** dans la liste
- Voir **3 commandes** reçues
- Statistiques:
  - Total produits: 10
  - Stock faible: 1-2 produits
  - Commandes: 3

**Pages à tester:**
- `/farmer-dashboard` - Dashboard principal
- `/farmer-dashboard/add-product` - Ajouter un produit
- `/farmer-dashboard/orders` - Mes commandes
- `/messages` - Messagerie (1 conversation)
- `/profile` - Mon profil

---

### Test 2: Connexion Client 🛒

1. **Se déconnecter** du compte agriculteur
2. Retourner sur `/auth/login`
3. **Email**: `customer1@test.com`
4. **Password**: `password123`
5. Cliquer "Se connecter"

**✅ Résultats attendus:**
- Redirection vers `/buyer-dashboard`
- Voir **2 commandes**:
  - ORD-2026-001 (PROCESSING) - 35.0 TND
  - ORD-2026-003 (CONFIRMED) - 85.0 TND
- Statistiques:
  - Total commandes: 2
  - En cours: 1-2
  - Total dépensé: 120.0 TND

**Pages à tester:**
- `/buyer-dashboard` - Dashboard client
- `/marketplace` - Marketplace (10 produits)
- `/my-orders` - Mes commandes (2 commandes)
- `/messages` - Messagerie (1 conversation avec Ferme El Baraka)
- `/profile` - Mon profil

---

### Test 3: Marketplace (Sans Connexion) 🛍️

1. Se déconnecter (ou ouvrir navigation privée)
2. Ouvrir: http://localhost:4200/marketplace

**✅ Résultats attendus:**
- Voir **10 produits** affichés
- Produits visibles:
  - Tomates Bio - 8.5 TND/kg
  - Oranges Maltaises - 6.0 TND/kg
  - Poivrons Mixtes - 9.0 TND/kg
  - Citrons de Tunisie - 4.5 TND/kg
  - Courgettes Fraîches - 5.5 TND/kg
  - Fraises de Saison - 12.0 TND/kg
  - Huile d'Olive Extra Vierge - 25.0 TND/litre
  - Œufs Fermiers Bio - 15.0 TND/douzaine
  - Carottes Bio - 6.5 TND/kg
  - Miel de Fleurs - 35.0 TND/pot

**Actions à tester:**
- 🔍 Rechercher "tomate"
- 📂 Filtrer par catégorie (VEGETABLES, FRUITS)
- 📍 Filtrer par distance
- 🏷️ Filtrer "Bio uniquement"
- 🔽 Trier par prix (croissant/décroissant)
- 👁️ Cliquer sur un produit → Voir détails
- 🛒 Ajouter au panier

---

### Test 4: Détail Produit 📦

1. Depuis marketplace, cliquer sur "Tomates Bio"
2. URL: http://localhost:4200/product/{id}

**✅ Résultats attendus:**
- Nom: Tomates Bio
- Prix: 8.5 TND/kg
- Stock: 150 kg
- Description complète
- Image du produit
- Informations agriculteur:
  - Ferme El Baraka
  - Mohamed Ben Ali
  - Rating: 4.8/5
- Bouton "Ajouter au panier"
- Section "Produits similaires"

**Actions à tester:**
- Modifier quantité (-, +)
- Ajouter au panier
- Voir profil de l'agriculteur

---

### Test 5: Panier 🛒

1. Ajouter 2-3 produits au panier
2. Cliquer sur l'icône panier (en haut)
3. URL: http://localhost:4200/cart

**✅ Résultats attendus:**
- Liste des produits ajoutés
- Quantité modifiable
- Prix total calculé
- Frais de livraison
- Total général
- Formulaire d'adresse
- Bouton "Passer commande"

**Actions à tester:**
- Modifier quantité d'un produit
- Supprimer un produit
- Remplir l'adresse de livraison
- Passer commande (nécessite connexion)

---

### Test 6: Messagerie 💬

1. Se connecter comme `customer1@test.com`
2. Aller sur: http://localhost:4200/messages

**✅ Résultats attendus:**
- **1 conversation** avec "Ferme El Baraka"
- **4 messages** dans la conversation:
  1. Customer: "Bonjour, vos tomates sont-elles vraiment bio ?"
  2. Farmer: "Oui absolument ! Nous sommes certifiés..."
  3. Customer: "Parfait ! Je vais commander 2kg..."
  4. Farmer: "Avec plaisir ! N'hésitez pas..."
- Input pour envoyer un nouveau message

**Actions à tester:**
- Lire les messages
- Envoyer un nouveau message
- Voir l'heure des messages
- Badge de messages non lus

---

### Test 7: Profil Utilisateur 👤

1. Se connecter (agriculteur ou client)
2. Aller sur: http://localhost:4200/profile

**✅ Résultats attendus (Agriculteur):**
- Nom: Mohamed Ben Ali
- Email: farmer@test.com
- Téléphone: +216 98 123 456
- Adresse: Hammamet, Nabeul
- Profil agriculteur:
  - Ferme: Ferme El Baraka
  - Description
  - Certifications: Bio Tunisie, Ecocert
  - Spécialités

**✅ Résultats attendus (Client):**
- Nom: Leila Mansour / Karim Jebali
- Email, téléphone, adresse
- Historique de commandes

**Actions à tester:**
- Modifier les informations
- Changer le mot de passe
- Upload photo de profil
- Sauvegarder les modifications

---

### Test 8: Ajouter un Produit (Agriculteur) ➕

1. Se connecter comme `farmer@test.com`
2. Dashboard → "Ajouter un produit"
3. URL: http://localhost:4200/farmer-dashboard/add-product

**✅ Résultats attendus:**
- Formulaire complet avec:
  - Nom du produit
  - Description
  - Catégorie (dropdown)
  - Prix
  - Unité (kg, litre, pièce, etc.)
  - Stock
  - Images (upload)
  - Bio (checkbox)
  - Localisation
  - Date de récolte
- Bouton "Créer le produit"

**Actions à tester:**
- Remplir tous les champs
- Upload d'image
- Créer le produit
- Vérifier que le produit apparaît:
  - Dans le dashboard agriculteur
  - Dans le marketplace

---

### Test 9: Gérer les Commandes (Agriculteur) 📋

1. Se connecter comme `farmer@test.com`
2. Dashboard → "Mes commandes"
3. URL: http://localhost:4200/farmer-dashboard/orders

**✅ Résultats attendus:**
- **3 commandes** visibles:
  - ORD-2026-001 (PROCESSING)
  - ORD-2026-002 (DELIVERED)
  - ORD-2026-003 (CONFIRMED)
- Pour chaque commande:
  - Numéro
  - Client
  - Date
  - Montant
  - Produits
  - Statut
  - Bouton "Changer statut"

**Actions à tester:**
- Voir détails d'une commande
- Changer le statut:
  - PENDING → CONFIRMED
  - CONFIRMED → PROCESSING
  - PROCESSING → SHIPPED
  - SHIPPED → DELIVERED
- Télécharger bon de livraison
- Contacter le client (messagerie)

---

## 📊 VÉRIFICATIONS ENDPOINTS BACKEND

### Endpoints Publics (Sans Auth)

```powershell
# Tous les produits
Invoke-WebRequest -Uri "http://localhost:8081/api/products/public/all"
# Résultat attendu: 10 produits

# Un produit spécifique
Invoke-WebRequest -Uri "http://localhost:8081/api/products/public/{id}"

# Produits par catégorie
Invoke-WebRequest -Uri "http://localhost:8081/api/products/public/category/VEGETABLES"

# Recherche
Invoke-WebRequest -Uri "http://localhost:8081/api/products/public/search?keyword=tomate"

# Tous les agriculteurs
Invoke-WebRequest -Uri "http://localhost:8081/api/farmers/public/all"
# Résultat attendu: 1 agriculteur
```

### Endpoints Authentification

```powershell
# Login
$body = @{email="farmer@test.com"; password="password123"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8081/api/auth/login" -Method POST -Body $body -ContentType "application/json"
# Résultat attendu: Token JWT
```

### Endpoints Protégés (Avec JWT)

```powershell
# D'abord, récupérer le token
$login = Invoke-WebRequest -Uri "http://localhost:8081/api/auth/login" -Method POST -Body (@{email="farmer@test.com"; password="password123"} | ConvertTo-Json) -ContentType "application/json"
$token = ($login.Content | ConvertFrom-Json).data.token
$headers = @{Authorization="Bearer $token"}

# Mes produits (agriculteur)
Invoke-WebRequest -Uri "http://localhost:8081/api/products/my-products" -Headers $headers
# Résultat attendu: 10 produits

# Mes commandes (agriculteur)
Invoke-WebRequest -Uri "http://localhost:8081/api/orders/farmer/my-orders" -Headers $headers
# Résultat attendu: 3 commandes

# Mes conversations
Invoke-WebRequest -Uri "http://localhost:8081/api/messages/conversations" -Headers $headers
# Résultat attendu: 1 conversation
```

---

## ✅ CHECKLIST DE TEST COMPLÈTE

### Backend API
- [ ] GET /api/products/public/all → 10 produits
- [ ] GET /api/farmers/public/all → 1 agriculteur
- [ ] POST /api/auth/login → Token JWT
- [ ] GET /api/products/my-products → 10 produits (avec auth)
- [ ] GET /api/orders/farmer/my-orders → 3 commandes (avec auth)
- [ ] GET /api/messages/conversations → 1 conversation (avec auth)

### Frontend - Authentification
- [ ] Login agriculteur (farmer@test.com)
- [ ] Login client (customer1@test.com)
- [ ] Logout
- [ ] Inscription nouveau compte

### Frontend - Agriculteur
- [ ] Dashboard avec statistiques (10 produits, 3 commandes)
- [ ] Liste des produits (10 produits)
- [ ] Ajouter un nouveau produit
- [ ] Modifier un produit existant
- [ ] Supprimer un produit
- [ ] Voir les commandes (3 commandes)
- [ ] Changer statut d'une commande
- [ ] Bon de livraison (PDF)
- [ ] Messagerie (1 conversation)
- [ ] Profil

### Frontend - Client
- [ ] Dashboard avec statistiques (2 commandes)
- [ ] Marketplace (10 produits)
- [ ] Recherche produits
- [ ] Filtres (catégorie, bio, distance)
- [ ] Détail produit
- [ ] Ajouter au panier
- [ ] Gérer panier (modifier quantité, supprimer)
- [ ] Passer commande
- [ ] Voir mes commandes (2 commandes)
- [ ] Reorder (recommander)
- [ ] Facture (PDF)
- [ ] Messagerie (1 conversation)
- [ ] Profil

### UX/UI
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Loading skeletons
- [ ] Messages de succès/erreur
- [ ] Navigation fluide
- [ ] Animations

---

## 🔐 COMPTES DE TEST

### Agriculteur
```
Email: farmer@test.com
Password: password123
Nom: Mohamed Ben Ali
Ferme: Ferme El Baraka
Lieu: Hammamet, Nabeul
```

### Client 1
```
Email: customer1@test.com
Password: password123
Nom: Leila Mansour
Lieu: Tunis
Commandes: 2
```

### Client 2
```
Email: customer2@test.com
Password: password123
Nom: Karim Jebali
Lieu: Sousse
Commandes: 1
```

---

## 📦 DONNÉES CRÉÉES PAR LE DATASEEDER

### Produits (10)
1. Tomates Bio - 8.5 TND/kg - Stock: 150
2. Oranges Maltaises - 6.0 TND/kg - Stock: 200
3. Poivrons Mixtes - 9.0 TND/kg - Stock: 80
4. Citrons de Tunisie - 4.5 TND/kg - Stock: 120
5. Courgettes Fraîches - 5.5 TND/kg - Stock: 100
6. Fraises de Saison - 12.0 TND/kg - Stock: 50
7. Huile d'Olive Extra Vierge - 25.0 TND/litre - Stock: 30
8. Œufs Fermiers Bio - 15.0 TND/douzaine - Stock: 100
9. Carottes Bio - 6.5 TND/kg - Stock: 90
10. Miel de Fleurs - 35.0 TND/pot - Stock: 20

### Commandes (3)
1. **ORD-2026-001** (Customer1 → Farmer)
   - Produits: Tomates (2 kg) + Oranges (3 kg)
   - Total: 35.0 TND
   - Statut: PROCESSING
   - Date: Il y a 1 jour

2. **ORD-2026-002** (Customer2 → Farmer)
   - Produits: Fraises (1 kg)
   - Total: 12.0 TND
   - Statut: DELIVERED
   - Date: Il y a 3 jours

3. **ORD-2026-003** (Customer1 → Farmer)
   - Produits: Huile d'olive (2 L) + Miel (1 pot)
   - Total: 85.0 TND
   - Statut: CONFIRMED
   - Date: Il y a 6 heures

### Conversation (1)
- **Entre**: Customer1 (Leila Mansour) ↔ Farmer (Ferme El Baraka)
- **Messages**: 4
- **Dernier message**: Il y a 1 jour

---

## 🐛 TROUBLESHOOTING

### Problème: Base de données vide
**Solution**: Redémarrer le backend (voir instructions en haut)

### Problème: Erreur 403 sur l'API
**Solution**: 
- Vérifier le token JWT
- Se reconnecter

### Problème: Produits ne s'affichent pas
**Solution**:
1. Vérifier le backend: http://localhost:8081/api/products/public/all
2. Ouvrir la console F12 → Voir les erreurs
3. Vérifier CORS

### Problème: Frontend ne charge pas
**Solution**:
```powershell
cd frontend
Remove-Item -Recurse -Force .angular -ErrorAction SilentlyContinue
npm start
```

---

## 📞 SUPPORT

Si vous rencontrez des problèmes:
1. Exécutez `.\test-API.ps1` pour diagnostic automatique
2. Vérifiez la console frontend (F12)
3. Vérifiez les logs backend (terminal Java)
4. Vérifiez que MongoDB est démarré

**Bon test! 🚀**
