# 🌱 Plateforme Marketplace Agricole (Architecture Microservices & Full DevSecOps)

Bienvenue sur le dépôt principal de la plateforme **Agri-Marketplace**.  
Ce projet propose une solution complète pour mettre en relation directe **Agriculteurs** et **Clients**, développée suivant une architecture **Microservices** et des pratiques avancées **DevSecOps** (CI/CD sécurisé, Gestion des secrets, Observabilité, Qualité de code).

---

## 🏗 Architecture Globale

Le projet est divisé en plusieurs briques logicielles conteneurisées avec Docker et orchestrées via Kubernetes (Minikube).

### 🖥️ 1. Frontend (Interface Utilisateur)
* **Technologie :** Angular 17+ 
* **Serveur web :** Nginx
* **Rôles :** Espace Client (Customer) & Espace Agriculteur (Farmer).
* **Particularité :** Nginx agit comme Proxy Inversé (Reverse Proxy) pour relayer les requêtes `/api/` vers l'API Gateway, évitant ainsi les problèmes de CORS sur les navigateurs web.

### ⚙️ 2. Backend (Microservices Spring Boot Java 17)
L'architecture Microservices repose sur :
1. `api-gateway` : Le routeur central. Redirige dynamiquement le trafic réseau vers le bon microservice (Port 8080).
2. `auth-service` : Gère les inscriptions, la connexion, l'émission et la validation des tokens de sécurité (JWT).
3. `product-service` : Gère le catalogue des produits agricoles, les fermes, et les offres d'emploi.
4. `order-service` : Gère le système de création de commandes et les paniers.

### 🗄️ 3. Bases de Données
* **MongoDB** : Base de données NoSQL distribuée. Chaque microservice possède sa propre collection logique (`marketplace_auth`, `marketplace_product`, `marketplace_order`).

---

## 🔐 Configuration DevSecOps Complète

Ce projet implémente un pipeline DevSecOps de bout en bout :

### 🛡️ Gestion des Secrets (HashiCorp Vault)
* Déployé au cœur de Kubernetes, Vault agit comme un coffre-fort hautement sécurisé pour l'infrastructure. **Aucun mot de passe ou URI de base de données n'est stocké en clair dans le code source.**
* **Vault Agent Injector :** Lors du démarrage des Pods, l'injecteur Vault convertit de façon dynamique les secrets récupérés en un fichier `application.properties` en mémoire que Spring Boot vient lire.

### 🔍 Qualité de Code & SAST (SonarQube)
* Analyse statique de code de sécurité (SAST) intégrée.
* Scanner Maven configuré pour analyser tous les microservices et remonter les vulnérabilités de sécurité, les bugs (Code Smells) et la couverture de code directement sur le dashboard SonarQube centralisé.

### 📊 Observabilité (Prometheus & Grafana)
* **Spring Boot Actuator & Micrometer :** Expose les métriques internes de la JVM, des bases de données et du requêtage HTTP de chaque microservice.
* **Prometheus :** Scrape automatiquement les métriques des Pods Kubernetes grâce aux annotations `prometheus.io/scrape: "true"`.
* **Grafana :** Tableaux de bord dynamiques (Dashboard JVM Metrics) affichant l'état de santé en temps réel de tous les microservices Spring Boot.

### 🔄 CI/CD (Jenkins Kubernetes Cloud)
* Le service Jenkins tourne nativement sous forme de Pod.
* Pipeline prêt à compiler, builder des images Docker sécurisées et déployer automatiquement les nouvelles versions sur le cluster Minikube via des agents éphémères (JNLP Pods).

---

## 🚀 Démarrage Rapide (Déploiement Minikube)

### 1. Prérequis
Assurez-vous d'avoir installé les outils suivants :
* `Docker`
* `Minikube`
* `kubectl`
* `Helm` (Optionnel)

### 2. Procédure de déploiement (Kubernetes)

```bash
# 1. Démarrer Minikube
minikube start

# 2. Créer l'espace de travail
kubectl create namespace devsecops

# 3. Déployer l'infrastructure lourde et outils DevSecOps
kubectl apply -f k8s/mongodb-deployment.yaml -n devsecops
kubectl apply -f k8s/jenkins-deployment.yaml -n devsecops
kubectl apply -f k8s/monitoring-deployment.yaml -n devsecops
kubectl apply -f k8s/sonarqube-deployment.yaml -n devsecops

# 4. Configurer Vault et l'authentification Kubernetes
# Lancer le script fourni
chmod +x configure-vault.sh
./configure-vault.sh

# 5. Appliquer les déploiements Microservices Backend & Frontend
kubectl apply -f k8s/ -n devsecops

# 6. Vérifier l'état de préparation des Pods
kubectl get pods -n devsecops -w
```

### 3. Accéder aux services de l'infrastructure

Une fois les pods démarrés et stables, utilisez `minikube ip` (ex: `192.168.49.2`) et les ports NodePort configurés pour accéder aux interfaces :

* 🌐 **Application Plateforme (Frontend Nginx) :** `http://<MINIKUBE_IP>:30000`
* 🛡️ **SonarQube (Code Quality) :** `http://<MINIKUBE_IP>:32070` (admin / admin par défaut ou admin / admin123)
* 📊 **Grafana (Dashboards) :** `http://<MINIKUBE_IP>:32000` (admin / admin)
* 📈 **Prometheus (Métriques) :** `http://<MINIKUBE_IP>:30090`
* ⚙️ **Jenkins (CI/CD) :** `http://<MINIKUBE_IP>:32001`

---

## 👥 Comptes de démonstration pré-configurés

La base de données contient des comptes de test fonctionnels pour tester l'API ou l'interface:

**👨‍🌾 Agriculteur Test :** 
* Email : `alex@agriculteur.fr` 
* Mot de passe : `Password123!`

**🧑‍💼 Client Test :** 
* Email : `thomas@client.fr` 
* Mot de passe : `Password123!`

---
*Ce projet est maintenu sur la branche `feature/microservices-architecture`. Développé avec ❤️ pour maîtriser les pipelines DevSecOps modernes.*
