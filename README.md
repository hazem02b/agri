# 🌾 Agricultural Marketplace Platform

Une plateforme marketplace complète et professionnelle pour la vente directe de produits agricoles, développée avec **Angular**, **Spring Boot** et **MongoDB**.

## 📋 Table des matières

- [Aperçu du projet](#aperçu-du-projet)
- [Architecture](#architecture)
- [Technologies utilisées](#technologies-utilisées)
- [Intégrations API externes](#intégrations-api-externes)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Fonctionnalités](#fonctionnalités)
- [Structure du projet](#structure-du-projet)
- [API Endpoints](#api-endpoints)
- [Contribuer](#contribuer)

## 🎯 Aperçu du projet

Agricultural Marketplace Platform est une solution complète permettant aux agriculteurs de vendre leurs produits directement aux consommateurs. La plateforme offre:

- **Pour les Agriculteurs**: Gestion de produits, suivi des commandes, profil de ferme
- **Pour les Clients**: Navigation de produits, panier d'achat, suivi de commandes
- **Administrateurs**: Gestion complète de la plateforme

## 🏗️ Architecture

Le projet suit une architecture microservices moderne avec:

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────┐
│   Angular 17    │ ←─────→ │  Spring Boot 3.2 │ ←─────→ │  MongoDB    │
│    Frontend     │  REST   │     Backend      │  CRUD   │  Database   │
└─────────────────┘         └──────────────────┘         └─────────────┘
                                     ↓
                            ┌────────────────┐
                            │  External APIs │
                            │  - Stripe      │
                            │  - Shippo      │
                            └────────────────┘
```

## 🛠️ Technologies utilisées

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
  - Spring Security (JWT Authentication)
  - Spring Data MongoDB
  - Spring Web
  - Spring Validation
- **MongoDB** - Base de données NoSQL
- **JWT (JSON Web Tokens)** - Authentification stateless
- **Lombok** - Réduction du code boilerplate
- **ModelMapper** - Mapping DTO ⟷ Entity
- **Maven** - Gestion de dépendances

### Frontend
- **Angular 17** (Standalone Components)
- **TypeScript 5.2**
- **RxJS** - Programmation réactive
- **HTTP Client** - Communication avec l'API
- **Router** - Navigation SPA
- **Forms Module** - Gestion des formulaires

### DevOps & Tools
- **Git** - Contrôle de version
- **npm** - Gestionnaire de paquets frontend
- **Maven** - Build automation backend

## 🔌 Intégrations API externes

### 1. **Stripe API** (Paiements)
Service de paiement intégré pour:
- Création de paiements sécurisés
- **Split Payment**: Répartition automatique entre la plateforme et les agriculteurs
- Gestion des comptes Connect pour les agriculteurs
- Webhooks pour les événements de paiement

📚 Documentation: [https://stripe.com/docs/api](https://stripe.com/docs/api)

### 2. **Shippo API** (Logistique)
Service de gestion logistique pour:
- Calcul des coûts d'expédition
- Optimisation des tournées de livraison
- Création d'étiquettes d'expédition
- Suivi des colis en temps réel

📚 Documentation: [https://goshippo.com/docs/](https://goshippo.com/docs/)

### 3. **Autres plateformes compatibles** (Mentionnées par le professeur)
- **WooCommerce**: Plugin agricole
- **PrestaShop**: Marketplace locale
- **Open Food Network**: Traçabilité et scoring durabilité
- **Odoo**: ERP pour logistique et prévisions IA

## 📦 Installation

### Prérequis

- **Java JDK 17** ou supérieur
- **Node.js 18** ou supérieur
- **MongoDB 6.0** ou supérieur
- **Maven 3.8** ou supérieur
- **Angular CLI** (optionnel)

### 1. Cloner le repository

```bash
git clone https://github.com/hazem02b/agricultural-marketplace-fullstack.git
cd agricultural-marketplace-fullstack
```

### 2. Configuration Backend

#### Installer MongoDB

```bash
# Windows (avec Chocolatey)
choco install mongodb

# macOS (avec Homebrew)
brew install mongodb-community

# Linux (Ubuntu/Debian)
sudo apt-get install mongodb
```

#### Démarrer MongoDB

```bash
mongod --dbpath C:\data\db  # Windows
mongod --dbpath /data/db    # macOS/Linux
```

#### Compiler et lancer le backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Le backend sera accessible sur: `http://localhost:8080`

### 3. Configuration Frontend

```bash
cd frontend
npm install
npm start
```

Le frontend sera accessible sur: `http://localhost:4200`

## ⚙️ Configuration

### Backend (`application.properties`)

```properties
# Application
spring.application.name=Agricultural Marketplace Platform
server.port=8080

# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/agricultural_marketplace
spring.data.mongodb.database=agricultural_marketplace

# JWT
jwt.secret=VotreSecretJWTSuperSecurisePourProduction
jwt.expiration=86400000

# CORS
cors.allowed.origins=http://localhost:4200

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Logging
logging.level.com.agricultural.marketplace=DEBUG
```

### Frontend (`environment.ts`)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## 🚀 Utilisation

### 1. Créer un compte

**Client:**
- Aller sur `/auth/signup`
- Sélectionner "Client"
- Remplir le formulaire

**Agriculteur:**
- Aller sur `/auth/signup`
- Sélectionner "Agriculteur"
- Remplir le formulaire + informations de la ferme

### 2. Se connecter

- Aller sur `/auth/login`
- Entrer email et mot de passe
- Redirection automatique selon le rôle

### 3. Naviguer dans la plateforme

**En tant que Client:**
- Parcourir les produits sur `/marketplace`
- Filtrer par catégorie, rechercher, filtrer bio
- Ajouter au panier
- Passer commande
- Suivre les commandes sur `/orders`

**En tant qu'Agriculteur:**
- Accéder au dashboard `/farmer-dashboard`
- Ajouter des produits
- Gérer l'inventaire
- Voir les statistiques

## ✨ Fonctionnalités

### Authentification & Sécurité
- ✅ Inscription Client/Agriculteur
- ✅ Connexion avec JWT
- ✅ Déconnexion
- ✅ Routes protégées par rôle
- ✅ Token refresh automatique
- ✅ Hashage des mots de passe (BCrypt)

### Gestion des Produits
- ✅ CRUD complet des produits (Agriculteurs)
- ✅ Catégorisation avancée
- ✅ Images multiples
- ✅ Gestion du stock
- ✅ Prix par unité (kg, pièce, litre)
- ✅ Badge Bio
- ✅ Système de notation et avis
- ✅ Recherche et filtres

### Commandes
- ✅ Création de commande
- ✅ Calcul automatique du total
- ✅ Gestion du stock en temps réel
- ✅ Historique des commandes
- ✅ Suivi de livraison
- ✅ Annulation de commande
- ✅ Statuts: Pending, Confirmed, Shipped, Delivered

### Paiements (Stripe Integration)
- ✅ Création de Payment Intent
- ✅ Split Payment (Plateforme ⟷ Agriculteur)
- ✅ Comptes Stripe Connect pour agriculteurs
- ✅ Webhooks pour événements de paiement
- ✅ Méthodes: CB, PayPal, Cash on Delivery

### Logistique (Shippo Integration)
- ✅ Calcul des frais d'expédition
- ✅ Optimisation des tournées
- ✅ Génération d'étiquettes
- ✅ Suivi en temps réel

### Profils
- ✅ Profil client avec historique
- ✅ Profil agriculteur avec ferme
- ✅ Modification des informations
- ✅ Gestion des adresses

## 📁 Structure du projet

### Backend

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/agricultural/marketplace/
│   │   │   ├── config/           # Configurations (Security, CORS, etc.)
│   │   │   ├── controller/       # REST Controllers
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   ├── exception/        # Exception handling
│   │   │   ├── model/            # MongoDB Entities
│   │   │   ├── repository/       # MongoDB Repositories
│   │   │   ├── security/         # JWT, Filters, UserDetails
│   │   │   └── service/          # Business Logic
│   │   └── resources/
│   │       └── application.properties
│   └── test/                     # Tests unitaires
└── pom.xml                       # Maven dependencies
```

### Frontend

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/                 # Services, Guards, Interceptors
│   │   │   ├── guards/           # Auth Guard
│   │   │   ├── interceptors/     # JWT Interceptor
│   │   │   ├── models/           # TypeScript Interfaces
│   │   │   └── services/         # API Services
│   │   ├── features/             # Feature Modules
│   │   │   ├── auth/             # Login, Signup
│   │   │   ├── marketplace/      # Product listing
│   │   │   ├── farmer-dashboard/ # Farmer management
│   │   │   ├── orders/           # Order management
│   │   │   └── profile/          # User profile
│   │   ├── shared/               # Shared components
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── assets/                   # Images, fonts, etc.
│   ├── environments/             # Environment configs
│   └── styles.css                # Global styles
└── package.json
```

## 🔗 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Connexion | ❌ |
| POST | `/api/auth/signup` | Inscription | ❌ |

### Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products/public/all` | Tous les produits | ❌ |
| GET | `/api/products/public/{id}` | Produit par ID | ❌ |
| GET | `/api/products/public/category/{category}` | Par catégorie | ❌ |
| GET | `/api/products/public/farmer/{farmerId}` | Par agriculteur | ❌ |
| GET | `/api/products/public/search?keyword=` | Recherche | ❌ |
| POST | `/api/products` | Créer produit | ✅ FARMER |
| PUT | `/api/products/{id}` | Modifier produit | ✅ FARMER |
| DELETE | `/api/products/{id}` | Supprimer produit | ✅ FARMER |
| POST | `/api/products/{id}/review` | Ajouter avis | ✅ |

### Orders

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders` | Créer commande | ✅ |
| GET | `/api/orders` | Mes commandes | ✅ |
| GET | `/api/orders/{id}` | Commande par ID | ✅ |
| PUT | `/api/orders/{id}/status` | Mettre à jour statut | ✅ |
| DELETE | `/api/orders/{id}` | Annuler commande | ✅ |

### Farmers

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/farmers/public/all` | Tous les agriculteurs | ❌ |
| GET | `/api/farmers/public/{id}` | Agriculteur par ID | ❌ |
| GET | `/api/farmers/profile` | Mon profil | ✅ FARMER |
| PUT | `/api/farmers/profile` | Modifier profil | ✅ FARMER |

## 🧪 Tests

### Backend

```bash
cd backend
mvn test
```

### Frontend

```bash
cd frontend
npm test
```

## 📝 Exemples d'utilisation

### Créer un compte agriculteur (Frontend)

```typescript
const signupData: SignupRequest = {
  email: 'farmer@example.com',
  password: 'password123',
  firstName: 'Jean',
  lastName: 'Dupont',
  phone: '0612345678',
  role: UserRole.FARMER,
  farmName: 'Ferme Bio du Soleil',
  farmDescription: 'Production bio de fruits et légumes'
};

this.authService.signup(signupData).subscribe({
  next: (response) => console.log('Account created', response),
  error: (error) => console.error('Error', error)
});
```

### Créer un produit (Backend API)

```bash
curl -X POST http://localhost:8080/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tomates Bio",
    "description": "Tomates fraîches du jardin",
    "category": "VEGETABLES",
    "price": 3.5,
    "unit": "kg",
    "stock": 100,
    "isOrganic": true,
    "location": "Paris"
  }'
```

## 🤝 Contribuer

Les contributions sont les bienvenues ! Pour contribuer:

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est développé dans un cadre académique.

## 👥 Auteurs

- **Hazem** - Développement Full-Stack

## 🙏 Remerciements

- Professeur pour les recommandations d'APIs (Stripe, Shippo, WooCommerce, etc.)
- Design original: [Figma Agricultural Marketplace](https://www.figma.com/design/KGITcHKnPrrBXs3qBBwFIm/)
- Spring Boot & Angular communautés

## 📞 Support

Pour toute question ou support:
- Ouvrir une issue sur GitHub
- Email: hazem@example.com

---

**Note**: Ce projet est une implémentation professionnelle complète développée avec les meilleures pratiques de l'industrie. Les intégrations avec Stripe et Shippo sont prêtes pour la production (nécessitent des clés API réelles).
