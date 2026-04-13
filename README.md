# 🌱 Plateforme Marketplace Agricole (Architecture Microservices & DevSecOps)

Bienvenue sur le dépôt principal de la plateforme **Agri-Marketplace**.  
Ce projet propose une solution complète pour mettre en relation directe **Agriculteurs** et **Clients**, développée suivant une architecture Microservices et des pratiques avancées **DevSecOps**.

---

## 🏗 Architecture Globale

Le projet est divisé en plusieurs briques logicielles conteneurisées avec Docker et orchestrées via Kubernetes (Minikube).

### 🖥️ 1. Frontend (Interface Utilisateur)
* **Technologie :** Angular 17+ 
* **Serveur web :** Nginx
* **Rôles :** Espace Client (Customer) & Espace Agriculteur (Farmer).
* **Particularité :** Nginx agit comme Proxy Inversé (Reverse Proxy) pour relayer les requêtes `/api/` vers l'API Gateway, gérant de manière transparente les soucis de CORS sur les navigateurs web.

### ⚙️ 2. Backend (Microservices Spring Boot Java 17)
L'architecture Microservices repose sur :
1. `api-gateway` : Le routeur central. Redirige dynamiquement le trafic réseau vers le bon microservice.
2. `auth-service` : Gère les inscriptions, la connexion et l'émission des tokens de sécurité (JWT).
3. `product-service` : Gère le catalogue des produits agricoles, fermes, et offres d'emploi.
4. `order-service` : Gère le système de création de commandes, paiements, paniers, et la messagerie temps réel (WebSockets).

### 🗄️ 3. Bases de Données & Stockage Local
* **MongoDB** : Base de données NoSQL distribuée (Collections séparées par Microservice : `marketplace_auth`, `marketplace_product`, `marketplace_order`).

---

## 🔐 Pilier Sécurité (DevSecOps)

L'un des plus grands atouts de ce dépôt réside dans son architecture de sécurité centralisée :

* **HashiCorp Vault :** Déployé au cœur de Kubernetes, Vault agit comme un coffre-fort hautement sécurisé pour l'infrastructure. **Aucun système de mot de passe, ni URI de base de données n'est stocké en clair dans le code Java.**
* **Injection K8s & Spring Boot :** Lors du démarrage des Pods, l'injecteur Vault de Kubernetes convertit de façon dynamique les secrets récupérés (identifiants DB) en un fichier `application.properties` que Spring Boot vient lire.
* **Spring Security & CORS strict :** Protège farouchement les points d'entrée de chaque service avec des stratégies `allowedOriginPatterns` et de l'en-tête Bearer (JWT Token).

---

## 🔄 Pilier CI/CD (Automatisation)

* **Jenkins Intégré (Kubernetes Cloud) :** Le service Jenkins tourne de manière native sous forme de Pod à l'intérieur de l'espace de noms `devsecops`. 
* **Agents Dynamiques (Esclaves-Jnlp) :** Jenkins instancie à la volée des esclaves de compilation éphémères (Pods) afin de compiler le code (Maven), puis les détruit à la fin du processus pour optimiser la mémoire du Cluster.

---

## 🚀 Démarrage Rapide (Déploiement)

### 1. Prérequis
Garantir que les éléments suivants sont installés :
* `Docker` (Engine)
* `Minikube` (Cluster local Kubernetes)
* `kubectl` (CLI Kubernetes)
* `Helm` (Optionnel mais recommandé)

### 2. Procédure de déploiement (Kubernetes)
Exécuter l'application depuis le terminal :

```bash
# 1. Démarrer Minikube
minikube start

# 2. Créer l'espace de travail (namespace)
kubectl create namespace devsecops

# 3. Déployer l'infrastructure lourde (MongoDB / Vault / Jenkins)
kubectl apply -f k8s/mongodb-deployment.yaml -n devsecops
# (Configurer les secrets HashiCorp Vault manuellement / par script)

# 4. Appliquer les déploiements Microservices Backend & Frontend
kubectl apply -f k8s/api-gateway-deployment.yaml -n devsecops
kubectl apply -f k8s/auth-service-deployment.yaml -n devsecops
kubectl apply -f k8s/product-service-deployment.yaml -n devsecops
kubectl apply -f k8s/order-service-deployment.yaml -n devsecops

kubectl apply -f k8s/frontend-deployment.yaml -n devsecops

# 5. Récupérer l'URL de l'application Front-End
minikube service agri-frontend -n devsecops --url
```

---

## 👥 Comptes de démonstration pré-configurés
**Agriculteur Test :** 
* Email : `alex@agriculteur.fr` 
* Pass : `Password123!`

**Client Test :** 
* Email : `thomas@client.fr` 
* Pass : `Password123!`

---
*Ce projet est maintenu sur la branche `feature/microservices-architecture` au cours de son refactoring.*
