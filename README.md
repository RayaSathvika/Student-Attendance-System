Student Attendance Management System Using DevOps Tools

Project Overview

The Student Attendance Management System is a web-based application designed to help faculty members record, manage, and monitor student attendance.

The system allows faculty to mark attendance for seven periods in a day, store attendance records date-wise and period-wise, calculate monthly attendance percentages, identify students with low attendance, and export attendance reports as CSV files.

The project also demonstrates DevOps practices using GitHub, Jenkins, Docker, Kubernetes, and Selenium WebDriver.

Features

- Faculty attendance management
- Student list display
- Seven-period attendance marking
- Present and absent status selection
- Date-wise attendance storage
- Duplicate attendance prevention
- Attendance validation
- Monthly attendance calculation
- Present and absent totals
- Attendance percentage calculation
- Low-attendance identification
- CSV report export
- Persistent attendance data during application execution
- Automated Selenium testing
- Docker containerization
- Kubernetes deployment
- Jenkins CI pipeline
- GitHub version control

Technologies Used

Frontend

- HTML
- CSS
- JavaScript

Backend

- Node.js
- Express.js

Database

- SQLite

DevOps Tools

- Git
- GitHub
- Jenkins
- Docker
- Kubernetes

Testing

- Selenium WebDriver
- JavaScript
- Google Chrome

System Architecture

The system consists of a frontend, backend API, database, testing environment, and DevOps pipeline.

The frontend provides the attendance interface to faculty members. The Node.js and Express.js backend handles requests and communicates with the SQLite database. Docker is used to containerize the backend application. Kubernetes manages the application deployment, while Jenkins automates the CI pipeline. Selenium WebDriver is used to perform automated functional testing.

Project Structure

Student-Attendance-System
│
├── backend
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── k8s
│   ├── deployment.yaml
│   └── service.yaml
│
├── tests
│   ├── package.json
│   ├── package-lock.json
│   └── attendance.test.js
│
├── Dockerfile
├── docker-compose.yml
├── Jenkinsfile
├── .dockerignore
├── .gitignore
└── README.md

Application Workflow

1. Faculty opens the attendance application.
2. The student list is loaded from the backend.
3. Faculty selects the required date.
4. Attendance is marked as Present or Absent for each of the seven periods.
5. The attendance is validated before saving.
6. Attendance records are stored in the SQLite database.
7. Duplicate attendance records are prevented.
8. Monthly attendance data can be generated.
9. Attendance percentage is calculated for each student.
10. Students with attendance below the required threshold are identified.
11. The monthly report can be exported as a CSV file.

Backend API

The backend provides the following API endpoints:

Check API Status

GET /

Returns the status of the Student Attendance Management System API.

Get Students

GET /api/students

Returns the list of students.

Save Attendance

POST /api/attendance

Stores attendance records for the selected date and periods.

Get Daily Attendance

GET /api/attendance?date=YYYY-MM-DD

Returns attendance records for a specific date.

Generate Monthly Report

GET /api/monthly-report?month=YYYY-MM

Generates monthly attendance totals and percentages.

Running the Application

Step 1: Clone the Repository

git clone https://github.com/RayaSathvika/Student-Attendance-System.git

Step 2: Open the Project

cd Student-Attendance-System

Step 3: Install Backend Dependencies

cd backend
npm install

Step 4: Start the Backend

node server.js

The backend runs on:

http://localhost:5000

Step 5: Open the Frontend

Open:

frontend/index.html

in a web browser.

Docker

The backend application is containerized using Docker.

Build Docker Image

docker build -t student-attendance-system-backend:latest .

Run Docker Container

docker run -d --name attendance-backend -p 5001:5000 student-attendance-system-backend:latest

Check Running Container

docker ps

Test Dockerized Backend

curl http://localhost:5001/

Docker Compose

The application can also be started using Docker Compose.

docker compose up -d --build

Check the running services:

docker compose ps

Stop the services:

docker compose down

Kubernetes

The application is deployed to Kubernetes using a Deployment and a Service.

Apply Deployment

kubectl apply -f k8s/deployment.yaml

Apply Service

kubectl apply -f k8s/service.yaml

Check Pods and Services

kubectl get pods,services

Check Deployment

kubectl get deployments

Port Forwarding

kubectl port-forward service/attendance-backend-service 5002:5000

The backend can then be accessed through:

http://localhost:5002

Jenkins CI Pipeline

Jenkins is used to automate the project build, testing, Docker containerization, and Kubernetes deployment.

The Jenkins pipeline performs the following stages:

1. Checkout source code from GitHub
2. Install backend dependencies
3. Check backend syntax
4. Build Docker image
5. Run Docker container test
6. Test Kubernetes access
7. Deploy application to Kubernetes
8. Install Selenium dependencies
9. Execute Selenium automated tests

The pipeline is defined in:

Jenkinsfile

Selenium Testing

Selenium WebDriver with JavaScript is used to test the application automatically.

The project contains 10 test cases:

1. Page Load
2. Student List Display
3. Seven Periods
4. Present / Absent Selection
5. Save Attendance
6. Validation
7. Duplicate Prevention
8. Monthly Totals / Percentage
9. Low Attendance Detection
10. CSV Export / Persistence

Expected test result:

Passed: 10
Failed: 0
ALL 10 SELENIUM TESTS PASSED SUCCESSFULLY!

GitHub

Git and GitHub are used for source-code management and version control.

Repository:

https://github.com/RayaSathvika/Student-Attendance-System

The repository contains the frontend, backend, testing files, Docker configuration, Kubernetes configuration, Jenkins pipeline, and project documentation.

Project Result

The Student Attendance Management System successfully provides attendance management functionality with seven daily periods, monthly attendance reports, percentage calculation, low-attendance detection, and CSV export.

The project also demonstrates the integration of DevOps tools by maintaining the source code in GitHub, automating the build and testing process using Jenkins, containerizing the backend using Docker, deploying the application using Kubernetes, and validating application functionality using 10 Selenium test cases.

Author
Raya Sathvika
Vidya Jyothi Institute of Technology
