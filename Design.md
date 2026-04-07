# Smart Task Manager – Detailed Design Document

---

## 1. Introduction

The Smart Task Manager is a full-stack web application designed to help users efficiently manage their daily tasks. The application supports user authentication, task creation, task tracking, and performance-oriented features such as pagination and filtering.

The project was built to gain practical experience in designing and implementing real-world applications using modern technologies like Spring Boot and React.

---

## 2. Objectives

* Build a secure full-stack application with authentication
* Understand frontend-backend communication
* Implement user-specific data handling
* Practice clean architecture and modular coding
* Implement real-world features like pagination, filtering, and search

---

## 3. High-Level Architecture

The application follows a **three-tier architecture**:

### 1. Presentation Layer (Frontend)

* Built using React
* Handles UI rendering and user interaction

### 2. Application Layer (Backend)

* Built using Spring Boot
* Contains business logic, authentication, and APIs

### 3. Data Layer (Database)

* H2 in-memory database
* Stores users and tasks

### Data Flow:

User → React UI → REST API (Spring Boot) → Database (H2)
Database → Backend → Frontend → User

---

## 4. Technology Stack

### Frontend:

* React (Functional Components, Hooks)
* Axios (HTTP requests)
* React Router (navigation)

### Backend:

* Spring Boot
* Spring Security
* JWT (JSON Web Token)
* Hibernate (JPA)

### Database:

* H2 (in-memory relational database)

---

## 5. Authentication & Authorization Design

### Signup Flow:

1. User enters name, email, password
2. Password is encrypted using BCrypt
3. User is stored in database

### Login Flow:

1. User enters email and password
2. Backend validates credentials
3. JWT token is generated
4. Token is returned to frontend

### Authorization Flow:

1. Token is stored in localStorage
2. For each protected API request:

   * Token is sent in Authorization header
3. Backend validates token using JWT filter
4. Access is granted if token is valid

---

## 6. Database Design

### User Entity:

* id (Primary Key)
* name
* email (unique)
* password

### Task Entity:

* id (Primary Key)
* title
* description
* status (COMPLETED / PENDING)
* dueDate
* priority (HIGH / MEDIUM / LOW)
* user_id (Foreign Key)

### Relationship:

* One-to-Many (One User → Many Tasks)

---

## 7. Backend Design

The backend follows a layered architecture:

### Controller Layer:

* Handles HTTP requests
* Maps endpoints

### Service Layer:

* Contains business logic
* Processes data before sending to repository

### Repository Layer:

* Interacts with database using JPA

---

## 8. API Design

### Authentication APIs:

* POST /api/auth/signup
* POST /api/auth/login

### Task APIs:

* GET /api/tasks?page=0&size=5
* POST /api/tasks
* PUT /api/tasks/{id}
* DELETE /api/tasks/{id}

### Filtering:

* GET /api/tasks?status=COMPLETED

### Search:

* GET /api/tasks/search?keyword=task

### Stats:

* GET /api/tasks/stats

---

## 9. Feature Implementation Details

### 9.1 Pagination

Pagination is implemented using Spring Data JPA Pageable interface.

* Allows fetching limited records per request
* Improves performance and scalability
* Frontend sends page and size parameters

---

### 9.2 Filtering

Tasks are filtered based on status using query parameters.

* Backend uses repository methods
* Returns only matching tasks

---

### 9.3 Search Functionality

Search is implemented using title matching.

* Case-insensitive search
* Uses JPA query methods

---

### 9.4 Dashboard Statistics

Statistics are calculated using repository count methods:

* Total tasks
* Completed tasks
* Pending tasks

---

### 9.5 Priority & Due Date

* Priority is implemented using Enum
* Due date stored using LocalDate
* Helps users organize tasks effectively

---

### 9.6 Dark Mode

* Implemented using React state
* Stored in localStorage
* Applied globally using CSS classes

---

## 10. Frontend Design

### Components:

* Login Page
* Signup Page
* Dashboard
* Task List
* Task Form

### State Management:

* useState for managing data
* useEffect for API calls

### Routing:

* React Router used for navigation
* Protected routes implemented using JWT

---

## 11. Error Handling

* Backend returns proper HTTP status codes
* Frontend displays user-friendly messages
* Handles invalid login and duplicate email

---

## 12. Security Considerations

* Passwords are hashed using BCrypt
* JWT used for stateless authentication
* APIs are protected using Spring Security

---

## 13. Performance Considerations

* Pagination reduces load time
* Filtering reduces unnecessary data transfer
* Efficient database queries using JPA

---

## 14. Challenges Faced

* Implementing JWT authentication correctly
* Managing frontend and backend integration
* Designing clean architecture
* Handling multiple features together (pagination, filtering, search)

---

## 15. Future Enhancements

* Drag-and-drop task management
* File/image upload support
* Real-time updates using WebSockets
* Deployment on cloud platforms

---

## 16. Conclusion

This project demonstrates a complete full-stack application with authentication, data management, and user-focused features. It helped in understanding system design, API development, and frontend-backend integration in depth.
