pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: jenkins-sa
  containers:
    - name: jnlp
      image: jenkins/inbound-agent:latest
      args: ['-url', 'http://jenkins-agent.jenkins.svc.cluster.local:50000', '$(JENKINS_SECRET)', '$(JENKINS_NAME)']
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
                container('docker') {
                    echo "Déploiement sur Minikube..."
                    sh "sed -i 's|image: .*agri-backend.*|image: ${DOCKER_HUB_USERNAME}/agri-backend:${APP_VERSION}|g' k8s/backend.yml"
                    sh "sed -i 's|image: .*agri-frontend.*|image: ${DOCKER_HUB_USERNAME}/agri-frontend:${APP_VERSION}|g' k8s/frontend.yml"
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
