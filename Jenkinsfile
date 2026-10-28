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
                bat 'timeout /t 5 /nobreak'
                bat 'curl http://localhost:5003/'
                bat 'docker stop attendance-jenkins-test'
            }
        }

    }

    post {
        success {
            echo 'Student Attendance System CI pipeline completed successfully.'
        }

        failure {
            echo 'Student Attendance System CI pipeline failed.'
        }
    }
}