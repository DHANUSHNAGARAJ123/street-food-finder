# 🍜 Street Food Finder

A full-stack web application to discover street food vendors near you. Customers can search vendors by menu items, vendors can manage their shop, and admins can approve vendors and reviews.

---

## 🖥️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6, Axios |
| Backend | Java 17, Spring Boot 3.2, Spring Security, JWT |
| Database | MySQL 8 |

---

## ✅ Prerequisites

Install these before starting:

- [Java 17+](https://www.oracle.com/java/technologies/downloads/)
- [Maven 3.8+](https://maven.apache.org/download.cgi)
- [Node.js 18+](https://nodejs.org/)
- [MySQL 8](https://dev.mysql.com/downloads/)
- [Git](https://git-scm.com/)

---

## 🚀 Setup Instructions

### Step 1: Clone the project

```bash
git clone https://github.com/DHANUSHNAGARAJ123/street-food-finder.git
cd street-food-finder
```

---

### Step 2: Database Setup

Open **MySQL Workbench** and run:

```sql
CREATE DATABASE streetfood_db;
USE streetfood_db;

CREATE TABLE admin_credentials (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL
);

INSERT INTO admin_credentials (email, password, name)
VALUES ('nagarajdhanush88@gmail.com', 'dhanush', 'Dhanush Admin');
```

---

### Step 3: Backend Setup

```bash
cd backend
```

Open `src/main/resources/application.properties` and update your MySQL password:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/streetfood_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
server.port=8080
```

Run the backend:

```bash
mvn clean spring-boot:run
```

✅ Backend runs on: `http://localhost:8080`

---

### Step 4: Frontend Setup

Open a **new terminal**:

```bash
cd streetfood-frontend
npm install
npm run dev
```

✅ Frontend runs on: `http://localhost:5173`

---

## 🔐 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | nagarajdhanush88@gmail.com | dhanush |
| Customer | Register a new account | - |
| Vendor | Register a new account | - |

> **Note:** Admin credentials are stored in the `admin_credentials` table. Customer and Vendor accounts can be registered from the login page.

---

## ✨ Features

### 👤 Customer
- Search vendors by **menu item name** (e.g. "Chicken", "Dosa")
- Results sorted by **rating** (highest first)
- Filter by price range, rating, open status, location
- View vendor details - menu, reviews, photos
- ❤️ Like / Favorite vendors
- 🗺️ Get directions via Google Maps

### 🏪 Vendor
- Register shop (pending admin approval)
- Add / Edit / Delete menu items
- Upload up to 4 shop photos
- Go **Live** / **Offline** toggle
- View customer reviews (admin approved only)
- Add Google Maps location URL

### 🛡️ Admin
- Approve / Reject vendor registrations
- Approve / Reject customer reviews
- Manage all users
- View platform statistics
- Reviews only show to customers after admin approval

---

## 📁 Project Structure

```
street-food-finder/
│
├── README.md
│
├── backend/                          # Spring Boot Backend
│   └── src/main/java/com/streetfood/
│       ├── controller/               # REST API endpoints
│       │   ├── AuthController.java
│       │   ├── PublicVendorController.java
│       │   ├── VendorManagementController.java
│       │   ├── AdminController.java
│       │   ├── FavoriteController.java
│       │   ├── ReviewController.java
│       │   └── ImageUploadController.java
│       ├── model/                    # JPA Entity models
│       │   ├── User.java
│       │   ├── Vendor.java
│       │   ├── MenuItem.java
│       │   ├── Review.java
│       │   ├── Favorite.java
│       │   └── AdminCredential.java
│       ├── repository/               # Spring Data JPA
│       ├── service/                  # Business logic
│       ├── security/                 # JWT Auth
│       │   ├── JwtUtil.java
│       │   └── JwtFilter.java
│       └── config/                   # Security + Web config
│
└── streetfood-frontend/              # React Frontend
    └── src/
        ├── pages/
        │   ├── admin/                # Admin dashboard pages
        │   │   ├── AdminHome.jsx
        │   │   ├── AdminVendors.jsx
        │   │   ├── AdminUsers.jsx
        │   │   └── AdminReviews.jsx
        │   ├── customer/
        │   │   └── CustomerDashboard.jsx
        │   ├── vendor/
        │   │   └── VendorDashboard.jsx
        │   ├── Login.jsx
        │   ├── RegisterCustomer.jsx
        │   ├── RegisterVendor.jsx
        │   └── VendorDetail.jsx
        ├── context/
        │   └── AuthContext.jsx       # Auth state management
        ├── api/
        │   └── axios.js              # API configuration
        └── App.jsx                   # Routes
```

---

## 🔑 API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/register-customer` | Public | Customer register |
| POST | `/api/auth/register-vendor` | Public | Vendor register |
| GET | `/api/vendors` | Public | All approved vendors |
| GET | `/api/vendors/search?q=chicken` | Public | Search by menu item |
| GET | `/api/vendors/{id}` | Public | Vendor details |
| GET | `/api/vendors/{id}/menu` | Public | Vendor menu |
| GET | `/api/vendor/my-shop` | Vendor | My shop details |
| PUT | `/api/vendor/toggle-live` | Vendor | Go live/offline |
| POST | `/api/vendor/menu` | Vendor | Add menu item |
| GET | `/api/admin/stats` | Admin | Platform stats |
| PUT | `/api/admin/vendors/{id}/approve` | Admin | Approve vendor |
| PUT | `/api/admin/reviews/{id}/approve` | Admin | Approve review |

---

## 📸 Image Upload

- Vendors can upload up to **4 shop photos**
- First photo = shop logo + hero image on customer page
- Photos stored in `backend/uploads/vendors/`
- Max file size: **5MB per image**

---

## 🗺️ Google Maps Integration

Vendors can add a **Google Maps URL** in their profile:
1. Open Google Maps → Search your shop location
2. Click **Share** → Copy link
3. Paste in vendor profile → **Location URL field**
4. Customers click "Open Maps" → Direct directions open

---

## ⚠️ Common Issues

**Backend won't start:**
- Check MySQL is running on port 3306
- Check username/password in `application.properties`
- Make sure `streetfood_db` database exists

**Frontend can't connect to backend:**
- Make sure backend is running on port 8080
- Check browser console for CORS errors

**Admin login not working:**
- Make sure `admin_credentials` table exists in MySQL
- Run the SQL insert command from Step 2

---

## 👨‍💻 Developer

Built by **Dhanush Nagaraj**

---
