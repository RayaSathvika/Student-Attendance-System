pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Install') {
            steps {
                bat 'cd backend && npm install'
            }
        }

        stage('Backend Test') {
            steps {
                bat 'cd backend && node --check server.js'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t student-attendance-system-backend:latest .'
            }
        }

        stage('Docker Test') {
            steps {
                bat 'docker run --rm -d --name attendance-jenkins-test -p 5003:5000 student-attendance-system-backend:latest'
                sleep 5
                bat 'curl http://localhost:5003/'
                bat 'docker stop attendance-jenkins-test'
            }
        }
stage('Kubernetes Test') {
    steps {
        bat 'kubectl version --client'
        bat 'set KUBECONFIG=C:\\Users\\rayas\\.kube\\config && kubectl get nodes'
    }
}

stage('Kubernetes Deploy') {
    steps {
        bat 'docker save student-attendance-system-backend:latest -o attendance-backend.tar'
        bat 'docker exec -i desktop-control-plane ctr -n k8s.io images import - < attendance-backend.tar'
        bat 'set KUBECONFIG=C:\\Users\\rayas\\.kube\\config && kubectl apply -f k8s\\deployment.yaml'
        bat 'set KUBECONFIG=C:\\Users\\rayas\\.kube\\config && kubectl apply -f k8s\\service.yaml'
        bat 'set KUBECONFIG=C:\\Users\\rayas\\.kube\\config && kubectl rollout restart deployment/attendance-backend'
        bat 'set KUBECONFIG=C:\\Users\\rayas\\.kube\\config && kubectl rollout status deployment/attendance-backend --timeout=120s'
        bat 'set KUBECONFIG=C:\\Users\\rayas\\.kube\\config && kubectl get pods'
        bat 'set KUBECONFIG=C:\\Users\\rayas\\.kube\\config && kubectl get services'
    }
}
        stage('Selenium Install') {
            steps {
                bat 'cd tests && npm install'
            }
        }

        stage('Selenium Test') {
            steps {
                bat 'cd tests && node attendance.test.js'
            }
        }

    }

    post {
        success {
            echo 'Student Attendance System CI pipeline completed successfully.'
        }

        failure {
            echo 'Student Attendance System CI pipeline failed.'
            bat 'docker stop attendance-jenkins-test || exit 0'
        }
    }
}