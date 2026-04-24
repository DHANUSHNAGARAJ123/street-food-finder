# 🍜 Street Food Finder — Full-Stack Vendor Discovery System

An AI-ready, full-stack web application designed to bridge the gap between local street food vendors and customers. The platform features role-based access for Customers, Vendors, and Admins with real-time status management.

---

## ✨ Features

### 👤 Customer Features
- **Smart Search** — Find vendors by specific food items or menu names.
- **Advanced Filtering** — Sort by ratings, price range, and proximity.
- **Interactive Profiles** — View high-quality food photos, reviews, and live status.
- **Navigation** — Integrated Google Maps links for precise vendor locations.

### 🏪 Vendor Features
- **Digital Storefront** — Register and manage a professional shop profile.
- **Dynamic Menu** — Add, edit, or remove menu items with pricing in real-time.
- **Live Status** — Toggle "Live" or "Offline" status to manage customer expectations.
- **Review Tracking** — Monitor customer feedback and ratings.

### 🛡️ Admin Features
- **Vendor Verification** — Approve or reject new vendor registrations.
- **Content Moderation** — Review and manage customer feedback.
- **System Insights** — View platform statistics and user growth.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router |
| **State Management** | Context API (Auth & Global State) |
| **Styling** | Tailwind CSS / CSS3 |
| **Backend** | Java 17, Spring Boot 3.2 |
| **Security** | Spring Security, JWT (JSON Web Tokens) |
| **Database** | MySQL 8.0 |
| **Build Tool** | Maven |

---

## 📁 Project Structure

```text
street-food-finder/
├── backend/                    # Spring Boot Application
│   ├── src/main/java/com/streetfood/
│   │   ├── controller/         # REST API Endpoints
│   │   ├── model/              # Database Entities
│   │   ├── repository/         # JPA Data Access
│   │   ├── service/            # Business Logic
│   │   ├── security/           # JWT & Auth Logic
│   │   └── config/             # App Configurations
│   └── src/main/resources/     # application.properties
│
└── streetfood-frontend/        # React Frontend
    ├── src/
    │   ├── pages/
    │   │   ├── admin/          # Admin Dashboards
    │   │   ├── customer/       # Customer Discovery Views
    │   │   ├── vendor/         # Vendor Management Pages
    │   │   ├── Login.jsx       # Universal Login
    │   │   └── Register.jsx    # Multi-role Registration
    │   ├── context/            # AuthContext provider
    │   ├── api/                # Axios instance & Interceptors
    │   └── App.jsx             # Routes & Layout
🚀 Getting Started
Prerequisites
Java 17+ — Download

Node.js 18+ — Download

MySQL 8.0 — Download

Maven — Download

1. Database Setup
Run the following script in your MySQL Workbench to initialize the system:

SQL
CREATE DATABASE streetfood_db;
USE streetfood_db;

-- Initial Admin Setup
CREATE TABLE admin_credentials (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL
);

-- Default Admin Account
INSERT INTO admin_credentials (email, password, name)
VALUES ('admin@example.com', 'admin123', 'Dhanush Admin');
2. Backend Setup
Navigate to backend/src/main/resources/application.properties.

Update your MySQL credentials:

Properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
Run the application:

Bash
cd backend
mvn clean install
mvn spring-boot:run
Backend API runs at: http://localhost:8080

3. Frontend Setup
Bash
cd streetfood-frontend
npm install
npm run dev
Frontend runs at: http://localhost:5173

🔒 Security Implementation
Stateless Auth — Uses JWT to handle sessions securely without cookies.

RBAC — Role-Based Access Control ensures unauthorized access to sensitive panels is blocked.

Password Safety — BCrypt hashing for secure credential storage in MySQL.

🛡️ Troubleshooting
CORS Errors: Check @CrossOrigin in Spring Controllers.

Port Conflict: Ensure ports 8080 and 5173 are free.

Maven Dependencies: If offline, run mvn dependency:go-offline before losing connection.

👨‍💻 Author
Dhanush Full-Stack Developer | Machine Learning Enthusiast

📄 License
This project is licensed under the MIT License — feel free to use and modify it for your own learning!
