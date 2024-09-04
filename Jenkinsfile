pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/main']],
                          userRemoteConfigs: [[url: 'https://github.com/johnboomi/2-tier-app.git',
                                               credentialsId: 'your-credentials-id']]])
            }
        }
        stage('Build') {
            steps {
                script {
                    // Correct the Docker build command to specify the Dockerfile and the context
                    sh 'docker build -t todo-app -f Dockerfile .'
                }
            }
        }
        stage('Test') {
            steps {
                script {
                    // Ensure the directory is correct if 'npm install' needs to be run in a specific folder
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }
        stage('Security Check') {
            steps {
                script {
                    // Install Snyk and authenticate
                    sh 'npm install -g snyk'
                    withCredentials([string(credentialsId: 'snyk-token', variable: 'SNYK_TOKEN')]) {
                        sh 'snyk auth $SNYK_TOKEN'
                    }
                    // Run Snyk security tests
                    sh 'snyk test'
                    sh 'snyk monitor' // Optional
                }
            }
        }
        stage('Push Image') {
            steps {
                script {
                    // Define AWS region and ECR repository name
                    def awsRegion = 'us-east-1'
                    def ecrRepoName = 'secops'
                    def ecrUrl = "590183914488.dkr.ecr.${awsRegion}.amazonaws.com/${ecrRepoName}"
                    // Authenticate with AWS ECR
                    sh "aws ecr get-login-password --region ${awsRegion} | docker login --username AWS --password-stdin ${ecrUrl}"
                    // Tag and push the Docker image
                    sh "docker tag todo-app:latest ${ecrUrl}:latest"
                    sh "docker push ${ecrUrl}:latest"
                }
            }
        }
        stage('Deploy to EKS') {
            steps {
                withKubeConfig([credentialsId: 'kubelogin']) {
                    script {
                        sh 'kubectl apply -f k8s/deployment.yaml'
                        sh 'kubectl apply -f k8s/service.yaml'
                    }
                }
            }
        }
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }
    }
}
