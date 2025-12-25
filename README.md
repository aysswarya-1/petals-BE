# 🌸 Petals-BE (Backend)

Petals-BE is the backend REST API for the **Petals** application, built using **Node.js** and **Express.js**.  
It follows a clean, modular structure with controllers, routes, services, and models for scalability and maintainability.

---

## 🚀 Features

- RESTful API using **Express.js**
- Modular architecture (controllers, routes, services)
- Middleware-based request handling
- Environment-based configuration
- Database models and seeders
- Ready to integrate with a frontend application

---

## 🧱 Project Structure

```
petals-BE/
│
├── config/               # Configuration files (DB, constants, env setup)
├── controllers/          # Business logic for routes
├── middlewares/          # Custom Express middlewares
├── models/               # Database schemas/models
├── routes/               # API route definitions
├── seeder/               # Database seed scripts
├── services/             # Reusable service logic
├── utils/                # Utility/helper functions
│
├── .gitignore
├── package.json
├── server.js             # Application entry point
```

---

## 📦 Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- Database (MongoDB / SQL – based on configuration)

---

## 🔧 Installation

```bash
git clone https://github.com/aysswarya-1/petals-BE.git
cd petals-BE
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root:

```
PORT=5000
DB_URI=your_database_connection_string
JWT_SECRET=your_secret_key
```

---

## ▶️ Running the Server

```bash
npm start
```

or (development)

```bash
npm run dev
```

---

## 📌 API Endpoints (Sample)

| Method | Endpoint             | Description          |
|------|----------------------|----------------------|
| GET  | /api/health          | Server health check  |
| POST | /api/auth/login      | User login           |
| POST | /api/auth/register   | User registration    |
| GET  | /api/users           | Get all users        |

---

## 🌱 Database Seeding

```bash
node seeder/index.js
```

---

## 📄 License

No license specified yet.

---

## 👩‍💻 Author

Ayswarya  
GitHub: https://github.com/aysswarya-1
