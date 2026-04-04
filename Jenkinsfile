pipeline {
    agent {
        kubernetes {
            cloud 'kubernetes'
            namespace 'jenkins'
            serviceAccount 'jenkins-sa'
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
      - name: jnlp
        image: 'jenkins/inbound-agent:latest'
        workingDir: '/home/jenkins/agent'
      - name: maven
        image: 'maven:3.9-eclipse-temurin-17'
        command: ['sh', '-c', 'while true; do sleep 3600; done']
        ttyEnabled: true
      - name: node
        image: 'node:18-alpine'
        command: ['sh', '-c', 'while true; do sleep 3600; done']
        ttyEnabled: true
      - name: docker
        image: 'docker:20.10.24'
        command: ['sh', '-c', 'while true; do sleep 3600; done']
        ttyEnabled: true
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

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/hazem02b/agri.git'
            }
        }

        stage('Build Backend') {
            steps {
                container('maven') {
                    sh 'mvn -f backend/pom.xml clean install -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                container('node') {
                    sh 'cd frontend && npm install'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                container('docker') {
                    sh 'eval $(minikube -p minikube docker-env)'
                    sh 'docker build -t agri-backend:latest backend'
                    sh 'docker build -t agri-frontend:latest frontend'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/namespace.yml'
                sh 'kubectl apply -f k8s/mongo.yml -n agri-app'
                sh 'kubectl apply -f k8s/backend.yml -n agri-app'
                sh 'kubectl apply -f k8s/frontend.yml -n agri-app'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
    }
}
