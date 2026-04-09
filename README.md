# 🌾 Agri Marketplace - Pipeline DevSecOps & Microservices

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=Jenkins&logoColor=white)
![Vault](https://img.shields.io/badge/Vault-000000?style=for-the-badge&logo=vault&logoColor=white)

Une plateforme de mise en relation directe entre les agriculteurs et des acheteurs locaux, déployée sur un cluster Kubernetes avec une approche **DevSecOps** complète.

## 🏗️ Architecture du Projet

Le projet adopte une architecture modulaire :
- **Frontend** : Application Angular avec cartographie interactive (Leaflet).
- **Backend API** : Spring Boot 3 (API REST, Authentification JWT, Google OAuth2).
- **Base de données** : MongoDB.
- **Gestion des Secrets** : HashiCorp Vault (injecteur Kubernetes) pour isoler les mots de passe de la DB.
- **Routage / Réseau** : NGINX Ingress Controller sur Kubernetes.

### 🛡️ Pipeline CI/CD (DevSecOps)
Le projet est packagé via un `Jenkinsfile` qui respecte le cycle suivant :
1. **Build Node & Angular** (`npm run build`).
2. **Build Maven** (Tests et compilation du `.jar`).
3. **Code Quality** : Analyse SonarQube (mock/plugin).
4. **Containerization** : Création des images Docker (Frontend & Backend).
5. **Sécurité (DAST/SCA)** : Scan des vulnérabilités des images Docker via **Trivy**.
6. **Déploiement Continu** : Application des manifestes YAML avec `kubectl apply` sur le cluster Minikube avec Ingress.

---

## 🚀 Installation & Lancement Local

### Prérequis
- [Minikube](https://minikube.sigs.k8s.io/docs/start/) et `kubectl` installés.
- Docker & Jenkins (Si exécution locale du pipeline).

### 1. Configuration du réseau local (Ingress)
L'application est servie via le domaine `agri-connect.local`. 
Il faut mapper l'IP de votre cluster Minikube dans le fichier hosts de votre système d'exploitation.

Obtenez l'IP de Minikube :
```bash
minikube ip
```
Puis ajoutez la ligne suivante dans `/etc/hosts` (ex: `192.168.49.2 agri-connect.local`) :
```bash
echo "$(minikube ip) agri-connect.local" | sudo tee -a /etc/hosts
```

### 2. Déploiement K8s manuel (Si sans Jenkins)
Activer l'Ingress Kubernetes :
```bash
minikube addons enable ingress
```

Déployer les différents composants :
```bash
kubectl apply -f k8s/vault-sa.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

---

## 🌍 Accès à l'application
- **Plateforme Web :** [http://agri-connect.local](http://agri-connect.local)
- **API Backend :** [http://agri-connect.local/api](http://agri-connect.local/api)

*Note : L'authentification Google OAuth peut nécessiter la configuration du nouvel URI d'origine (`http://agri-connect.local`) dans la console Google Cloud.*

### 👨‍🌾 Comptes de Test disponibles (Dev)
- Agriculteur : `agriculteur@agri.com` (MDP : `password123`)
- Acheteur : `acheteur@agri.com` (MDP : `password123`)

---

## 🛠️ Dépannage fréquent
- **Cartes Leaflet qui ne s'affichent pas :** Les CSS de base Leaflet et la fonction `invalidateSize()` gèrent l'affichage dynamique dans Angular/Vite.
- **Erreur CORS Ingress :** L'Ingress et Spring Boot Boot valident le header CORS. Le domaine `agri-connect.local` est whitelisted.
- **Jenkins : Permission denied (Ingresses)** : Jenkins doit avoir un `Role` RBAC dans K8S l'autorisant sur le groupe API `networking.k8s.io` pour gérer l'Ingress.
