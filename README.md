# Task Manager - Full-stack Project Management Tool using Java 21, React, and MySQL 

This is a comprehensive full-stack **Task Manager Application**, a lightweight project management tool that allows users to create, assign, track, and complete tasks. Built with **Java 21**, **Spring Boot 3**, and **React**, it features a clean, professional UI and a robust backend architecture designed for scalability and maintainability.

---
---

##  Project Links
* **Frontend Repository:** https://github.com/Maheesha-Nethmina/NodeZS_Frontend
* **Backend Repository:** https://github.com/Maheesha-Nethmina/NodeZS_Backend

##  Key Features

This application evaluates clean code, sensible design, and attention to detail through a thoughtful user experience.

###  Task Management
* **Task Lifecycle:** Create tasks with required titles, optional descriptions, due dates, and priority levels (Low, Medium, High).
* **Dynamic Dashboard:** View all tasks with the ability to filter by status (To Do, In Progress, Done) and sort by due date or priority.
* **Task Updates:** Update any field of an existing task or mark it as "Done" to automatically record a completion timestamp.
* **User Assignment:** Assign tasks to specific users via email and view a filtered list of personal assignments.
* **Task Unassignment:** A custom feature allowing users to remove themselves from a selection, resetting the task to "To Do" for others to pick up.


##  Tech Stack

This project is built with a modern, high-performance architecture.

| Category | Technology |
| :--- | :--- |
| **Frontend** |React 18+, Vite, React Router v6, Axios, Tailwind CSS  |
| **Backend** | Java 21, Spring Boot 3.x, Spring Data JPA, Maven  |
| **Database** | MySQL  |

---
##  Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or newer)
* [JDK 21](https://www.oracle.com/java/technologies/downloads/#java21)
* [Maven](https://maven.apache.org/)
* [MySQL](https://www.mysql.org/)

### 1. Backend Setup (Spring Boot)
1. Clone the repository and navigate to the `NodeZS_backend` directory.
2. Create a MySQL database named `nodezs_databse`.
3. Open `src/main/resources/application.properties` and update `spring.datasource.url`, `username`, and `password`.
4. Run the backend server

The API will be running on `http://localhost:8080`.

### 2. Frontend Setup (React App)
1. Navigate to the `NodeZS_frontend` directory.
2. Install required NPM packages:
    ```sh
    npm install
    ```
3. Run the development server:
    ```sh
    npm run dev
    ```
    The application will open and run on `http://localhost:5173`.

---

##  API Endpoints

[cite_start]The backend follows RESTful conventions, ensuring resources are identified by nouns and standard HTTP methods are utilized[cite: 45, 46, 50].

### User & Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/v1/user/save` | Registers a new user account. |
| **POST** | `/api/v1/user/login` | Authenticates a user and starts a session. |
| **POST** | `/api/v1/user/logout` | logout users. |

### Task Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/v1/task/save` | Creates a new task (Title required). |
| **GET** | `/api/v1/task/getAllPaged` | Fetches all tasks with pagination, status filtering, and sorting. |
| **GET** | `/api/v1/task/getMyTasks` | Fetches tasks created by the logged-in user. |
| **GET** | `/api/v1/task/getAssignedTasks` | Fetches tasks assigned to a specific user via email. |
| **PUT** | `/api/v1/task/update` | Updates existing task fields (Title, Priority, etc.). |
| **PUT** | `/api/v1/task/updateStatus` | Specialized endpoint for status transitions and assignments. |
| **DELETE** | `/api/v1/task/delete/{id}` | Permanently removes a task (Requires UI confirmation). |

---



##  Design Decisions & Assumptions
* **Database Choice:** **MySQL** was chosen for its strong relational integrity, ensuring that task assignments and user metadata remain consistent.
* **Manual Sorting Logic:** To achieve specific hierarchical sort (Priority: High → Medium → Low), custom logic was implemented in the Service layer to provide granular control.
* **Task Unassignment Feature:** Implemented a "Remove Selection" button on the Selection page to allow users to unassign themselves, making tasks available for others again.
* **Separation of Concerns:** The project strictly follows the Controller-Service-Repository pattern to ensure maintainability.

---

##  Known Limitations & Future Improvements
* **Real-time Search:** A planned enhancement is a debounced search bar to filter tasks by keywords.
* **Database-Level Slicing:** Currently, sorting is done in-memory. For scalability, I would move this to database-level `OrderBy` queries via `Pageable`.
* **User Interface (UI) Refinement:** I plan to replace basic loading text with CSS Skeleton Screens and add Framer Motion animations. This will create smoother transitions when tasks change states and provide a more polished, modern feel.

