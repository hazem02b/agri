# Guide de démarrage rapide

## 🚀 Démarrage en 5 minutes

### 1. Installer les dépendances

```bash
# Backend
cd backend
mvn clean install

# Frontend
cd frontend
npm install
```

### 2. Démarrer MongoDB

```bash
# Windows
mongod --dbpath C:\data\db

# macOS/Linux
mongod --dbpath /data/db
```

### 3. Lancer le backend

```bash
cd backend
mvn spring-boot:run
```

Le backend sera sur: http://localhost:8080

### 4. Lancer le frontend

```bash
cd frontend
npm start
```

Le frontend sera sur: http://localhost:4200

## 📝 Comptes de test

### Agriculteur
- Email: `farmer@test.com`
- Password: `password123`

### Client
- Email: `customer@test.com`
- Password: `password123`

## 🔧 Problèmes courants

### MongoDB ne démarre pas
```bash
# Créer le dossier data
mkdir C:\data\db    # Windows
mkdir /data/db      # macOS/Linux
```

### Port déjà utilisé
- Backend (8080): Modifier `server.port` dans `application.properties`
- Frontend (4200): Lancer avec `ng serve --port 4201`

## 📚 Documentation complète

Voir [README.md](README.md) pour la documentation complète.
