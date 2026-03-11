# 🚀 Guide d'Installation Complet - Agricultural Marketplace Platform

## Prérequis à installer

Votre système nécessite l'installation des outils suivants pour exécuter le projet complet.

---

## 1. ☕ Installation de Java JDK 17

### Windows

**Option A - Via Chocolatey (Recommandé)**
```bash
# Installer Chocolatey si pas déjà installé (en tant qu'Admin)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Installer Java
choco install openjdk17 -y
```

**Option B - Téléchargement manuel**
1. Télécharger: https://adoptium.net/
2. Choisir: OpenJDK 17 (LTS)
3. Installer et ajouter au PATH

**Vérification:**
```bash
java -version
# Devrait afficher: openjdk version "17.x.x"
```

---

## 2. 📦 Installation de Maven

### Windows

**Via Chocolatey:**
```bash
choco install maven -y
```

**Manuel:**
1. Télécharger: https://maven.apache.org/download.cgi
2. Extraire dans `C:\Program Files\Apache\Maven`
3. Ajouter au PATH: `C:\Program Files\Apache\Maven\bin`

**Vérification:**
```bash
mvn -version
# Devrait afficher: Apache Maven 3.x.x
```

---

## 3. 🍃 Installation de MongoDB

### Windows

**Option A - MongoDB Community Server (Recommandé pour développement)**
1. Télécharger: https://www.mongodb.com/try/download/community
2. Choisir: Windows x64 / MSI
3. Installer avec l'option "Complete"
4. Cocher "Install MongoDB as a Service"

**Option B - Via Chocolatey:**
```bash
choco install mongodb -y
```

**Configuration:**
```bash
# Créer le dossier data
New-Item -ItemType Directory -Path C:\data\db -Force

# Démarrer MongoDB (si pas installé comme service)
mongod --dbpath C:\data\db
```

**Option C - MongoDB Atlas (Cloud - Gratuit)**
Si vous ne voulez pas installer localement:
1. Créer un compte: https://www.mongodb.com/cloud/atlas/register
2. Créer un cluster gratuit
3. Obtenir la connection string
4. Modifier `application.properties`:
```properties
spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/agricultural_marketplace
```

**Vérification:**
```bash
mongod --version
# Devrait afficher: db version v6.x.x
```

---

## 4. 📝 Vérification de Node.js et npm

Déjà installé sur votre système ✅

```bash
node --version  # v18+ requis
npm --version   # v9+ requis
```

---

## 5. 🔧 Installation de Git (si nécessaire)

**Via Chocolatey:**
```bash
choco install git -y
```

**Manuel:**
- Télécharger: https://git-scm.com/download/win

---

## 📥 Installation Rapide - Toutes les Dépendances

### Script PowerShell (Exécuter en tant qu'Administrateur)

```powershell
# Installer Chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Installer tous les outils
choco install openjdk17 maven mongodb git -y

# Créer le dossier MongoDB
New-Item -ItemType Directory -Path C:\data\db -Force

Write-Host "✅ Installation terminée!" -ForegroundColor Green
Write-Host "Redémarrez votre terminal PowerShell puis vérifiez:" -ForegroundColor Yellow
Write-Host "  java -version" -ForegroundColor Cyan
Write-Host "  mvn -version" -ForegroundColor Cyan
Write-Host "  mongod --version" -ForegroundColor Cyan
```

---

## 🚀 Démarrage du Projet Complet

Une fois tous les outils installés:

### Étape 1: Démarrer MongoDB

**Si installé comme service (automatique):**
```bash
# MongoDB démarre automatiquement
# Vérifier le statut:
Get-Service MongoDB
```

**Si installation manuelle:**
```bash
# Terminal 1
mongod --dbpath C:\data\db
```

### Étape 2: Démarrer le Backend Spring Boot

```bash
# Terminal 2
cd C:\Users\HAZEM\agricultural-marketplace-fullstack\backend
mvn clean install
mvn spring-boot:run
```

Le backend sera accessible sur: **http://localhost:8080**

### Étape 3: Démarrer le Frontend Angular

```bash
# Terminal 3
cd C:\Users\HAZEM\agricultural-marketplace-fullstack\frontend
npm install  # (déjà en cours)
npm start
```

Le frontend sera accessible sur: **http://localhost:4200**

---

## 🔍 Vérification du Statut

### Vérifier MongoDB
```bash
# Se connecter à MongoDB
mongosh
# ou
mongo

# Lister les bases de données
show dbs

# Sortir
exit
```

### Vérifier le Backend
```bash
# Tester l'API
curl http://localhost:8080/api/products/public/all
```

### Vérifier le Frontend
Ouvrir dans le navigateur: http://localhost:4200

---

## ⚠️ Résolution des Problèmes Courants

### MongoDB ne démarre pas
```bash
# Vérifier si le port 27017 est utilisé
netstat -ano | findstr :27017

# Arrêter le processus si nécessaire
taskkill /PID <PID> /F

# Redémarrer MongoDB
mongod --dbpath C:\data\db
```

### Maven - Erreur de mémoire
Ajouter au fichier `backend\.mvn\jvm.config`:
```
-Xmx1024m
```

### Port déjà utilisé
**Backend (8080):**
Modifier dans `application.properties`:
```properties
server.port=8081
```

**Frontend (4200):**
```bash
ng serve --port 4201
```

---

## 📊 Architecture Finale

```
┌─────────────────────────────────────────────────┐
│  http://localhost:4200 - Frontend Angular      │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  http://localhost:8080 - Backend Spring Boot   │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  mongodb://localhost:27017 - MongoDB           │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Prochaines Étapes

Une fois tout installé et démarré:

1. ✅ Ouvrir http://localhost:4200
2. ✅ Créer un compte (Client ou Agriculteur)
3. ✅ Tester les fonctionnalités
4. ✅ Consulter l'API: http://localhost:8080/api

---

## 📞 Aide

Si vous rencontrez des problèmes:
1. Vérifier que tous les services sont démarrés
2. Vérifier les logs dans les terminaux
3. Consulter `API_DOCUMENTATION.md` pour les endpoints

**Commandes de vérification rapide:**
```powershell
# Vérifier tous les services
java -version
mvn -version
mongod --version
node --version
npm --version

# Vérifier les ports utilisés
netstat -ano | findstr "8080 4200 27017"
```
