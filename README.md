# Smart Task Manager

Hi! This is a full-stack project I built to understand how real-world web applications work using Java (Spring Boot) and React.

The goal of this project is to allow users to manage their daily tasks in a simple and efficient way, while also implementing important backend concepts like authentication and secure APIs.

---

## What this project does

* Users can sign up and log in securely
* Each user can manage their own tasks
* Add, update, and delete tasks
* Mark tasks as completed or pending
* Filter tasks based on status
* Search tasks by title
* Set due dates for tasks
* Assign priority (High / Medium / Low)
* View dashboard stats (total, completed, pending tasks)
* Pagination for better performance
* Dark / Light mode for better user experience

---

## Tech Stack

**Frontend:**

* React (Hooks)
* Axios
* React Router

**Backend:**

* Spring Boot
* Spring Security + JWT Authentication
* Hibernate (JPA)

**Database:**

* H2 (in-memory database)

---

## Authentication

I implemented JWT-based authentication:

* Passwords are encrypted using BCrypt
* Users receive a token after login
* Protected APIs can only be accessed with a valid token

---

## What I learned

While building this project, I focused on:

* Understanding full-stack flow (frontend → backend → database)
* Securing APIs using JWT
* Implementing pagination and filtering
* Structuring a clean backend with controllers, services, and repositories

---

## How to run this project

### 1. Clone the repository

git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

### 2. Run Backend

cd backend
mvn spring-boot:run

### 3. Run Frontend

cd frontend
npm install
npm run dev

---



This project uses H2 database, so data will reset every time the backend restarts.

---

