pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: maven
    image: maven:3.8-eclipse-temurin-17
    command:
    - cat
    tty: true
  - name: docker
    image: docker:cli
    command:
    - cat
    tty: true
    volumeMounts:
    - mountPath: /var/run/docker.sock
      name: docker-sock
  - name: node
    image: node:18-alpine
    command:
    - cat
    tty: true
  - name: trivy
    image: aquasec/trivy:0.49.1
    command:
    - cat
    tty: true
    volumeMounts:
    - mountPath: /var/run/docker.sock
      name: docker-sock
  volumes:
  - name: docker-sock
    hostPath:
      path: /var/run/docker.sock
'''
        }
    }

    environment {
        IMAGE_API_GATEWAY = 'agri-api-gateway'
        IMAGE_AUTH_SERVICE = 'agri-auth-service'
        IMAGE_PRODUCT_SERVICE = 'agri-product-service'
        IMAGE_ORDER_SERVICE = 'agri-order-service'
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
                    dir('microservices') {
                        sh 'mvn clean test jacoco:report || true'
                    }
                }
            }
        }

        stage('Backend: Analyse Statique de Sécurité (SAST)') {
            steps {
                container('maven') {
                    dir('microservices') {
                        // Exécution de Checkstyle, PMD, Spotbugs / FindSecBugs
                        sh 'mvn checkstyle:check pmd:check spotbugs:check || true'
                    }
                }
            }
        }

        stage('Backend: Package/Build JARs') {
            steps {
                container('maven') {
                    dir('microservices') {
                        sh 'mvn clean package -DskipTests'
                    }
                }
            }
        }

        stage('Frontend: Node.js & Angular Build') {
            steps {
                container('node') {
                    dir('frontend') {
                        sh 'npm install'
                        sh 'npm run build || true'
                    }
                }
            }
        }

        stage('Code Quality (SonarQube)') {
            steps {
                container('maven') {
                    dir('microservices') {
                        // En configuration réelle: withSonarQubeEnv('SonarQubeServer') { ... }
                        echo "Simulation: Envoi du rapport JaCoCo/PMD à SonarQube..."
                    }
                }
            }
        }

        stage('Containerization (Docker Build)') {
            steps {
                container('docker') {
                    dir('microservices/api-gateway') {
                        sh "docker build -t ${IMAGE_API_GATEWAY}:${TAG} -t ${IMAGE_API_GATEWAY}:latest ."
                    }
                    dir('microservices/auth-service') {
                        sh "docker build -t ${IMAGE_AUTH_SERVICE}:${TAG} -t ${IMAGE_AUTH_SERVICE}:latest ."
                    }
                    dir('microservices/product-service') {
                        sh "docker build -t ${IMAGE_PRODUCT_SERVICE}:${TAG} -t ${IMAGE_PRODUCT_SERVICE}:latest ."
                    }
                    dir('microservices/order-service') {
                        sh "docker build -t ${IMAGE_ORDER_SERVICE}:${TAG} -t ${IMAGE_ORDER_SERVICE}:latest ."
                    }
                    dir('frontend') {
                        sh "docker build -t ${IMAGE_FRONTEND}:${TAG} -t ${IMAGE_FRONTEND}:latest . || true"
                    }
                }
            }
        }

        stage('Scan Sécurité des Conteneurs (Trivy DAST/SCA)') {
            steps {
                container('trivy') {
                    echo "Scan des images avec Trivy..."
                    sh "trivy image --exit-code 1 --severity HIGH,CRITICAL --no-progress ${IMAGE_API_GATEWAY}:${TAG} || true"
                    sh "trivy image --exit-code 1 --severity HIGH,CRITICAL --no-progress ${IMAGE_AUTH_SERVICE}:${TAG} || true"
                    sh "trivy image --exit-code 1 --severity HIGH,CRITICAL --no-progress ${IMAGE_PRODUCT_SERVICE}:${TAG} || true"
                    sh "trivy image --exit-code 1 --severity HIGH,CRITICAL --no-progress ${IMAGE_ORDER_SERVICE}:${TAG} || true"
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
                    curl --retry 5 --retry-connrefused -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
                    chmod +x kubectl
                    ./kubectl apply -f k8s/vault-sa.yaml
                    ./kubectl apply -f k8s/mongodb-deployment.yaml
                    ./kubectl apply -f k8s/backend-deployment.yaml
                    ./kubectl apply -f k8s/frontend-deployment.yaml
                    ./kubectl apply -f k8s/ingress.yaml
                    '''
                }
            }
        }
    }
}
