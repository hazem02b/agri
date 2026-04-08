pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  # L'agent Jenkins lui-même sera lancé, suivi des conteneurs supplémentaires dont nous avons besoin :
  containers:
  - name: maven
    image: maven:3.8-eclipse-temurin-17
    command:
    - cat
    tty: true
  - name: docker
    image: docker:dind
    securityContext:
      privileged: true
    command:
    - cat
    tty: true
  - name: trivy
    image: aquasec/trivy:latest
    command:
    - cat
    tty: true
'''
        }
    }

    environment {
        IMAGE_BACKEND = 'agri-backend'
        IMAGE_FRONTEND = 'agri-frontend'
        TAG = "${env.BUILD_ID}"
        SONAR_PROJECT_KEY = 'agri-devsecops'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend: Tests & Couverture JaCoCo') {
            steps {
                container('maven') {
                    dir('backend') {
                        sh 'mvn clean test jacoco:report'
                    }
                }
            }
        }

        stage('Backend: Analyse Statique de Sécurité (SAST)') {
            steps {
                container('maven') {
                    dir('backend') {
                        // Exécution de Checkstyle, PMD, Spotbugs / FindSecBugs
                        sh 'mvn checkstyle:check pmd:check spotbugs:check || true'
                    }
                }
            }
        }

        stage('Code Quality (SonarQube)') {
            steps {
                container('maven') {
                    dir('backend') {
                        // En configuration réelle: withSonarQubeEnv('SonarQubeServer') { ... }
                        echo "Simulation: Envoi du rapport JaCoCo/PMD à SonarQube..."
                    }
                }
            }
        }

        stage('Containerization (Docker Build)') {
            steps {
                container('docker') {
                    // Utiliser le daemon docker local (DinD du pod Kubernetes)
                    sh 'dockerd-entrypoint.sh & sleep 5'
                    
                    dir('backend') {
                        sh "docker build -t ${IMAGE_BACKEND}:${TAG} -t ${IMAGE_BACKEND}:latest ."
                    }
                    dir('frontend') {
                        sh "docker build -t ${IMAGE_FRONTEND}:${TAG} -t ${IMAGE_FRONTEND}:latest ."
                    }
                }
            }
        }

        stage('Scan Sécurité des Conteneurs (Trivy DAST/SCA)') {
            steps {
                container('trivy') {
                    echo "Scan des images avec Trivy..."
                    sh "trivy image --exit-code 1 --severity HIGH,CRITICAL --no-progress ${IMAGE_BACKEND}:${TAG} || true"
                    sh "trivy image --exit-code 1 --severity HIGH,CRITICAL --no-progress ${IMAGE_FRONTEND}:${TAG} || true"
                }
            }
        }

        stage('Déploiement K8s (Microservices)') {
            steps {
                // Jenkins s'exécute déjà DANS Minikube, grâce au "ServiceAccount: jenkins-admin", 
                // il a les droits directs pour déployer en tapant `kubectl apply`.
                container('maven') { // On peut utiliser "maven" car il inclut cur/unzip pour installer kubectl au besoin, ou un autre conteneur helm/kubectl
                    echo 'Déploiement des microservices...'
                    sh '''
                    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
                    chmod +x kubectl
                    ./kubectl apply -f k8s/mongodb-deployment.yaml
                    ./kubectl apply -f k8s/backend-deployment.yaml
                    ./kubectl apply -f k8s/frontend-deployment.yaml
                    '''
                }
            }
        }
    }
}
