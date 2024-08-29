pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/johnboomi/2-tier-app.git'
            }
        }
        stage('Build') {
            steps {
                script {
                    sh 'docker build -f todo-app -t Dockerfile .'
                }
            }
        }
        stage('Test') {
            steps {
                // Install Dependencies
                sh 'npm install'
                
               // Run tests
                sh 'npm test'
            }
        }
        stage('Security Check') {
            steps {
                script {
                    // Install Snyk if not already installed
                    sh 'npm install -g snyk'
                    // Authenticate with Snyk (ensure you have your Snyk token set up in Jenkins credentials)
                    withCredentials([string(credentialsId: 'snyk-token', variable: 'SNYK_TOKEN')]) {
                        sh 'snyk auth $SNYK_TOKEN'
                    }
                    // Run Snyk test to check for vulnerabilities in project dependencies
                    sh 'snyk test'
                    // (Optional) Monitor project for Snyk dashboard
                    sh 'snyk monitor'
                }
            }
        }
        stage('Push Image') {
            steps {
                script {
                    // Define your AWS Region and ECR repository name
                    def awsRegion = 'us-east-1' // Replace with your desired AWS region
                    def ecrRepoName = 'secops' // Replace with your ECR repository name
                    def ecrUrl = "590183914488.dkr.ecr.${awsRegion}.amazonaws.com/${ecrRepoName}"
                    // Get ECR login credentials and log in to ECR
                    sh "aws ecr get-login-password --region ${awsRegion} | docker login --username AWS --password-stdin ${ecrUrl}"
                    // Tag the Docker image with the ECR repository URL
                    sh "docker tag todo-app:latest ${ecrUrl}:latest"
                    // Push the Docker image to the ECR repository
                    sh "docker push ${ecrUrl}:latest"
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
