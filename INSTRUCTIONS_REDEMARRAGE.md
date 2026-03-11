# 🚀 INSTRUCTIONS DE REDÉMARRAGE

**Date**: 10 Mars 2026

---

## ✅ Modifications Effectuées

1. **DataSeeder modifié** : Il supprimera maintenant automatiquement toutes les données existantes avant de créer les nouvelles données de test.
2. **Script de redémarrage créé** : `restart-backend.bat` pour faciliter le processus

---

## 🎯 ÉTAPES À SUIVRE MANUELLEMENT

### Option 1 : Utiliser le Script Automatique (RECOMMANDÉ)

1. **Ouvrez l'Explorateur Windows**
2. **Naviguez vers** : `C:\Users\HAZEM\agricultural-marketplace-fullstack`
3. **Double-cliquez** sur : `restart-backend.bat`
4. **Attendez** que le backend démarre et recherchez ces messages :
   ```
   🗑️ Clearing existing data...
   ✅ Existing data cleared.
   🌱 Seeding database with demo data...
   ✅ Database seeded successfully!
   📧 Farmer: farmer@test.com / password123
   📧 Customer 1: customer1@test.com / password123
   📧 Customer 2: customer2@test.com / password123
   ```

### Option 2 : Commandes Manuelles

Si le script ne fonctionne pas, suivez ces étapes dans un **nouveau terminal PowerShell** :

```powershell
# 1. Arrêter le backend
taskkill /F /IM java.exe

# 2. Aller dans le dossier backend
cd C:\Users\HAZEM\agricultural-marketplace-fullstack\backend

# 3. Nettoyer et compiler
mvn clean package -DskipTests

# 4. Démarrer le backend
java -jar target\marketplace-1.0.0.jar
```

---

## 🧪 APRÈS LE REDÉMARRAGE

Une fois que vous voyez **"✅ Database seeded successfully!"**, ouvrez un **nouveau terminal PowerShell** et lancez :

```powershell
cd C:\Users\HAZEM\agricultural-marketplace-fullstack
.\test-API.ps1
```

Ce script va automatiquement tester :
- ✅ Les 10 produits créés
- ✅ L'authentification
- ✅ Les endpoints protégés
- ✅ Les conversations
- ✅ Le frontend

---

## 🌐 TESTS DANS LE NAVIGATEUR

Après les tests automatiques, ouvrez votre navigateur :

1. **URL** : http://localhost:4200/auth/login
2. **Testez le compte Agriculteur** :
   - Email : `farmer@test.com`
   - Password : `password123`
   - Vous devriez voir 10 produits et 3 commandes

3. **Testez le compte Client** :
   - Déconnectez-vous
   - Email : `customer1@test.com`
   - Password : `password123`
   - Vous devriez voir 2 commandes et 1 conversation

Consultez [GUIDE_TEST_COMPLET.md](GUIDE_TEST_COMPLET.md) pour plus de détails.

---

## ❓ DÉPANNAGE

### Le backend ne démarre pas

- Vérifiez que **MongoDB est démarré** (cherchez "mongod" dans le Gestionnaire des tâches)
- Vérifiez que le **port 8081 est libre** :
  ```powershell
  Get-NetTCPConnection -LocalPort 8081
  ```

### Le DataSeeder ne s'exécute pas

- Assurez-vous d'avoir **recompilé** le backend après ma modification du fichier DataSeeder.java
- Les messages de seed doivent apparaître au démarrage, juste après "Started MarketplaceApplication"

### Je ne vois pas les messages de seed

- Le backend a peut-être déjà démarré avant : **fermez complètement** le terminal du backend et relancez

---

## 📝 FICHIERS CRÉÉS

1. **restart-backend.bat** - Script automatique de redémarrage
2. **restart-backend.ps1** - Version PowerShell du script
3. **reset-db.ps1** - Script de réinitialisation de la base de données (si besoin)
4. **test-API.ps1** - Script de test automatique des API
5. **GUIDE_TEST_COMPLET.md** - Guide détaillé de tous les tests à effectuer

---

## 🔧 MODIFICATION TECHNIQUE

**Fichier modifié** : `backend/src/main/java/com/agricultural/marketplace/config/DataSeeder.java`

**Changement** : Le DataSeeder supprime maintenant toujours les données existantes avant de créer les nouvelles, au lieu de vérifier si des données existent.

**Avant** :
```java
if (userRepository.count() > 0) {
    System.out.println("✅ Data already seeded. Skipping seed process.");
    return;
}
```

**Après** :
```java
System.out.println("🗑️ Clearing existing data...");
conversationRepository.deleteAll();
orderRepository.deleteAll();
productRepository.deleteAll();
userRepository.deleteAll();
System.out.println("✅ Existing data cleared.");
```

---

**Bonne chance avec les tests ! 🚀**
