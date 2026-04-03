pipeline {
    agent {
        kubernetes {
            // Définition du pod directement dans le Jenkinsfile
            yaml '''
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: jenkins-sa
  containers:
  - name: jnlp
    image: jenkins/inbound-agent:latest
    args: ['$(JENKINS_SECRET)', '$(JENKINS_NAME)']
    env:
    - name: JENKINS_URL
      value: http://jenkins-agent.jenkins.svc.cluster.local:50000
  - name: maven
    image: maven:3.9-eclipse-temurin-17
    command: ['cat']
    tty: true
  - name: node
    image: node:18-alpine
    command: ['cat']
    tty: true
  - name: docker
    image: docker:20.10.24
    command: ['cat']
    tty: true
    volumeMounts:
    - name: docker-sock
      mountPath: /var/run/docker.sock
  volumes:
  - name: docker-sock
    hostPath:
      path: /var/run/docker.sock
'''
        }
    }

    environment {
        DOCKER_HUB_USERNAME = 'hazembellili'
        APP_VERSION = "v${env.BUILD_ID}"
    }

    stages {
        stage('Checkout') {
            steps {
                // Le checkout se fait dans le conteneur jnlp par défaut
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                container('maven') {
                    sh 'mvn -f backend/pom.xml clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                container('node') {
                    dir('frontend') {
                        sh 'npm install'
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Build & Load Backend Image') {
            steps {
                container('docker') {
                    script {
                        def imageName = "${DOCKER_HUB_USERNAME}/agri-backend:${APP_VERSION}"
                        sh "docker build -t ${imageName} -f backend/Dockerfile backend"
                        echo "Image backend construite: ${imageName}"
                        sh "minikube -p minikube image load ${imageName}"
                        echo "Image backend chargée dans Minikube."
                    }
                }
            }
        }

        stage('Build & Load Frontend Image') {
            steps {
                container('docker') {
                    script {
                        def imageName = "${DOCKER_HUB_USERNAME}/agri-frontend:${APP_VERSION}"
                        sh "docker build -t ${imageName} -f frontend/Dockerfile frontend"
                        echo "Image frontend construite: ${imageName}"
                        sh "minikube -p minikube image load ${imageName}"
                        echo "Image frontend chargée dans Minikube."
                    }
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                // Ce conteneur a besoin de kubectl. Pour la simplicité, on suppose que l'image docker
                // pourrait être étendue pour l'inclure, ou on utiliserait une image dédiée.
                // Ici, on va essayer de l'exécuter dans le conteneur docker qui a au moins 'sh'.
                container('docker') {
                    echo "Déploiement sur Minikube..."
                    // Mettre à jour les fichiers de déploiement avec les nouvelles images
                    sh "sed -i 's|image: .*agri-backend.*|image: ${DOCKER_HUB_USERNAME}/agri-backend:${APP_VERSION}|g' k8s/backend.yml"
                    sh "sed -i 's|image: .*agri-frontend.*|image: ${DOCKER_HUB_USERNAME}/agri-frontend:${APP_VERSION}|g' k8s/frontend.yml"
                    
                    echo "NOTE: L'application directe avec kubectl depuis le pod est une pratique avancée."
                    echo "Pour ce pipeline, nous nous concentrons sur la construction et le chargement des images."
                    echo "Le déploiement final peut être fait manuellement ou avec un plugin comme 'Kubernetes CLI'."
                    
                    echo "Déploiement (simulation) terminé."
                }
            }
        }
    }
    post {
        always {
            echo "Pipeline terminé."
            // Nettoyage de l'espace de travail
            cleanWs()
        }
    }
}
