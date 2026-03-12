# AgriConnect - Marketplace Agricole (Full-Stack)

Plateforme web pour connecter agriculteurs et clients: publication de produits, commandes, messagerie, logistique, offres d'emploi et paiements.

Stack principale:
- Frontend: Angular 17
- Backend: Spring Boot 3.2 (Java 17)
- Base de donnees: MongoDB

## Fonctionnalites

- Authentification JWT (roles CLIENT / AGRICULTEUR)
- Marketplace produits (catalogue, details, filtres, panier)
- Commandes et suivi
- Messagerie en temps reel
- Logistique (offres, candidatures, suivi)
- Offres d'emploi (create/edit/apply)
- Profil utilisateur (photo, informations, mot de passe)
- Paiements (configuration preprod)

## Architecture

- frontend/: application Angular
- backend/: API Spring Boot + MongoDB
- scripts *.bat / *.ps1: utilitaires de lancement, test et maintenance

## Prerequis

- Java 17+
- Maven 3.8+
- Node.js 18+
- npm 9+
- MongoDB Server (mongod)

## Demarrage Rapide (Windows)

### 1) Cloner

```powershell
git clone https://github.com/hazem02b/agri.git
cd agri
```

### 2) Lancer MongoDB

Si `mongod` est dans le PATH:

```powershell
mongod --dbpath C:\data\db
```

Sinon (exemple chemin standard):

```powershell
& "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" "--dbpath" "C:\data\db"
```

### 3) Lancer le backend

```powershell
cd backend
mvn spring-boot:run
```

Backend actif par defaut sur:
- http://localhost:8081

### 4) Lancer le frontend

Dans un nouveau terminal:

```powershell
cd frontend
npm install
npm start
```

Frontend actif sur:
- http://localhost:4200

## Configuration Importante

### API frontend

Le frontend pointe vers:
- `frontend/src/environments/environment.ts`
- `apiUrl: 'http://localhost:8081/api'`

### Seeder (donnees de demo)

Le seeding auto est configurable via:
- `backend/src/main/resources/application.properties`
- `app.seed.enabled=false` pour tester a zero
- `app.seed.enabled=true` pour recreer des donnees de demo au demarrage

## Reset Base de Donnees (test a zero)

1. Arreter backend + mongod
2. Supprimer le dossier de donnees MongoDB (ex: `C:\data\db`)
3. Recreer le dossier
4. Relancer mongod puis backend
5. Verifier que `app.seed.enabled=false`

## Cache Navigateur (si vous voyez encore d'anciennes donnees)

Dans la console du navigateur sur localhost:4200:

```js
localStorage.clear();
sessionStorage.clear();
location.reload();
```

## Scripts utiles du repo

- `START.ps1`, `START.bat`: demarrage global
- `start-backend.ps1`, `START-BACKEND.bat`: backend
- `reset-db.ps1`: reset base
- `TESTER-APIS.bat`, `test-API.ps1`: verification API

## API et modules backend

Points techniques principaux:
- Spring Security + JWT
- Spring Data MongoDB
- Validation DTO
- Services: produits, commandes, messages, jobs, delivery, paiement

## Developpement

### Frontend

```powershell
cd frontend
npm start
```

### Backend

```powershell
cd backend
mvn spring-boot:run
```

### Build

```powershell
cd frontend
npm run build

cd ../backend
mvn clean package
```

## Troubleshooting

- Port backend deja occupe: verifier 8081 et tuer le processus en conflit.
- Erreurs d'encodage (texte casse): faire un hard refresh du navigateur et vider local/session storage.
- MongoDB non trouve: utiliser le chemin complet de `mongod.exe`.

## Contribution

1. Creer une branche feature
2. Commit propre avec message explicite
3. Ouvrir une Pull Request

## Licence

Projet academique / demonstrateur.
