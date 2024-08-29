pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/YOUR_USERNAME/todo-app.git'
            }
        }
        stage('Build') {
            steps {
                script {
                    sh 'docker build -t todo-app .'
                }
            }
        }
        stage('Test') {
            steps {
                // Add test steps here, if any.
            }
        }
        stage('Security Check') {
            steps {
                script {
                    // Snyk or other security tool command here.
                }
            }
        }
        stage('Push Image') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'dockerhub-pass', variable: 'DOCKER_PASS')]) {
                        sh 'docker login -u YOUR_DOCKER_USERNAME -p $DOCKER_PASS'
                        sh 'docker tag todo-app YOUR_DOCKER_USERNAME/todo-app:latest'
                        sh 'docker push YOUR_DOCKER_USERNAME/todo-app:latest'
                    }
                }
            }
        }
        stage('Deploy to EKS') {
            steps {
                script {
                    sh 'kubectl apply -f k8s/deployment.yaml'
                    sh 'kubectl apply -f k8s/service.yaml'
                }
            }
        }
    }
}