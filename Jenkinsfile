pipeline {
    agent {
        kubernetes {
            label 'my-agent'
            defaultContainer 'jnlp'
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: maven
    image: maven:3.9-eclipse-temurin-17
    command:
    - cat
    tty: true
  - name: node
    image: node:18-alpine
    command:
    - cat
    tty: true
  - name: docker
    image: docker:20.10.24
    command:
    - cat
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

        stage('Build & Push Backend Image') {
            steps {
                container('docker') {
                    script {
                        def imageName = "${DOCKER_HUB_USERNAME}/agri-backend:${APP_VERSION}"
                        sh "docker build -t ${imageName} -f backend/Dockerfile backend"
                        // Pour un vrai pipeline, vous ajouteriez ici la connexion à Docker Hub et le push
                        // sh 'docker login -u ... -p ...'
                        // sh "docker push ${imageName}"
                        echo "Image backend construite (push désactivé pour le test local) : ${imageName}"
                    }
                }
            }
        }

        stage('Build & Push Frontend Image') {
            steps {
                container('docker') {
                    script {
                        def imageName = "${DOCKER_HUB_USERNAME}/agri-frontend:${APP_VERSION}"
                        sh "docker build -t ${imageName} -f frontend/Dockerfile frontend"
                        // sh "docker push ${imageName}"
                        echo "Image frontend construite (push désactivé pour le test local) : ${imageName}"
                    }
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                container('docker') { // Utiliser un conteneur qui a kubectl/minikube ou l'installer
                    echo "Déploiement sur Minikube..."
                    // Cette étape est complexe car l'agent pod doit avoir accès à kubectl et au contexte minikube
                    // Pour une démo, nous allons simuler cette étape.
                    // Dans un vrai scénario, on utiliserait un conteneur avec kubectl configuré
                    // ou le plugin Kubernetes pour déployer.
                    echo "Mise à jour des fichiers de déploiement..."
                    sh "sed -i 's|image: .*agri-backend.*|image: ${DOCKER_HUB_USERNAME}/agri-backend:${APP_VERSION}|g' k8s/backend.yml"
                    sh "sed -i 's|image: .*agri-frontend.*|image: ${DOCKER_HUB_USERNAME}/agri-frontend:${APP_VERSION}|g' k8s/frontend.yml"
                    echo "NOTE: L'application directe avec kubectl depuis le pod est désactivée pour ce test."
                    // sh 'kubectl apply -f k8s/backend.yml'
                    // sh 'kubectl apply -f k8s/frontend.yml'
                    echo "Déploiement terminé (simulation)."
                }
            }
        }
    }
}
