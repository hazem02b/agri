pipeline {
    agent any

    environment {
        // Assure que le contexte kubectl est bien celui de minikube
        KUBECONFIG = '/var/jenkins_home/.kube/config'
    }

    stages {
        stage('Checkout') {
            steps {
                // Remplacez par l'URL de votre dépôt Git
                git url: 'https://github.com/hazem02b/agri.git', branch: 'main'
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build --prod'
                }
            }
        }

        stage('Build & Load Docker Images') {
            steps {
                script {
                    // Utilise le daemon Docker de Minikube
                    withEnv(['DOCKER_HOST=tcp://192.168.49.2:2376', 'DOCKER_TLS_VERIFY=0']) {
                        sh 'docker build -t agricultural-backend:latest ./backend'
                        sh 'minikube image load agricultural-backend:latest'
                        
                        sh 'docker build -t agricultural-frontend:latest ./frontend'
                        sh 'minikube image load agricultural-frontend:latest'
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/mongodb.yml'
                sh 'kubectl apply -f k8s/backend.yml'
                sh 'kubectl apply -f k8s/frontend.yml'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
    }
}
