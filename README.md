# 🚀 Service Provider Onboarding Portal

A full-stack web application designed to streamline the onboarding, document verification, and management of service providers. Providers can register, upload verification documents/photos, and track their application status in real-time. Admins can review submissions, inspect documents, approve providers, or reject them with feedback.

---

## ✨ Features

### 👤 Provider Features

- **Authentication:** Traditional Email/Password signup/login and **Google OAuth 2.0** integration.
- **Profile Management:** Submit personal details, category, skills, experience, and location.
- **Document Verification:** Upload profile photos and PDF/Image verification documents stored via ImageKit.
- **Application Tracking:** Real-time application status badges (`Pending`, `Approved`, `Rejected`).
- **Resubmission Flow:** If rejected by an admin, providers receive rejection remarks, can update their information/documents, and resubmit (which automatically resets their status to `Pending` for re-evaluation).

### 🛡️ Admin Features

- **Admin Control Panel:** Filterable dashboard to manage all applications (`All`, `Pending`, `Approved`, `Rejected`).
- **Search & Pagination:** Instant search by provider name or email.
- **Detailed Application Review:** Inspect provider profiles and preview uploaded verification documents in a clean modal.
- **Approval & Rejection:** One-click approval or rejection with mandatory feedback/remarks for the provider.

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Authentication:** `@react-oauth/google`
- **HTTP Client:** Axios

### Backend

- **Runtime:** Node.js & Express.js
- **Database:** MongoDB & Mongoose
- **Authentication:** JWT (JSON Web Tokens) & `bcrypt`
- **OAuth:** `google-auth-library`
- **File Uploads:** Multer & ImageKit SDK

---

## 📁 Project Structure

```text
├── client/                      # Frontend (Vite + React)
│   ├── src/
│   │   ├── api/                 # Axios instance configuration
│   │   ├── components/
│   │   │   ├── admin/           # Stats, FilterBar, ProviderTable, Modals
│   │   │   ├── common/          # StatusBadge, Modal, ErrorBoundary, GoogleAuthButton
│   │   │   └── provider/        # ProfileHeader, ActiveProfileCard, OnboardingForm
│   │   ├── pages/               # AdminDashboard, ProviderOnboarding, Login/Register pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env
│
└── server/                      # Backend (Node.js + Express)
    ├── src/
    │   ├── controllers/         # authController, providerController, adminController
    │   ├── models/              # User model
    │   ├── routes/              # authRoutes, providerRoutes, adminRoutes
    │   ├── middleware/          # authMiddleware, uploadMiddleware
    │   └── utils/               # jwt helpers, imagekit setup
    ├── server.js
    └── .env


```

## ⚙️ Environment Variables Setup

### Backend Environment Variables (`server/.env`)

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/onboarding
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=[https://ik.imagekit.io/your_imagekit_id](https://ik.imagekit.io/your_imagekit_id)
```

### Frontend Environment Variables (`client/.env`)

Create a `.env` file inside the `client/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas or Local MongoDB instance
- ImageKit Account (for file/image storage)
- Google Cloud Console OAuth 2.0 Credentials

### 1. Clone the Repository

```bash
git clone [https://github.com/cartikeyalavu/service-provider-onboarding.git](https://github.com/cartikeyalavu/service-provider-onboarding.git)
cd service-provider-onboarding
```

### 2. Backend Setup

```bash
cd server
npm install
npm run dev
```

The server should start running on http://localhost:3000.

### 3. Backend Setup

```
cd ../client
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## 🔒 API Endpoints Overview

| Method  | Endpoint                          | Description                                       | Access   |
| :------ | :-------------------------------- | :------------------------------------------------ | :------- |
| `POST`  | `/api/auth/register`              | Register a new user/provider                      | Public   |
| `POST`  | `/api/auth/login`                 | Login user                                        | Public   |
| `POST`  | `/api/auth/google`                | Google OAuth authentication                       | Public   |
| `GET`   | `/api/provider/profile`           | Get current provider profile                      | Provider |
| `PUT`   | `/api/provider/profile`           | Update profile / upload documents                 | Provider |
| `GET`   | `/api/admin/providers`            | Get all provider applications (filtered/searched) | Admin    |
| `PATCH` | `/api/admin/providers/:id/status` | Approve or reject provider with remarks           | Admin    |

## 🧪 API Documentation & Testing

A complete Postman API collection is available in the [`/docs`](./docs) folder.
Import `Service_Provider_Onboarding.postman_collection.json` into Postman or Bruno to test all endpoints locally.
