# 🚀 Service Provider Onboarding Portal

A full-stack web application designed to streamline the onboarding, document verification, and management of service providers. Providers can register, upload verification documents/photos, and track their application status in real-time. Admins can review submissions, inspect documents, approve providers, or reject them with feedback.

---

## ✨ Features

### 👤 Provider Features
* **Authentication:** Traditional Email/Password signup/login and **Google OAuth 2.0** integration.
* **Profile Management:** Submit personal details, category, skills, experience, and location.
* **Document Verification:** Upload profile photos and PDF/Image verification documents stored via ImageKit.
* **Application Tracking:** Real-time application status badges (`Pending`, `Approved`, `Rejected`).
* **Resubmission Flow:** If rejected by an admin, providers receive rejection remarks, can update their information/documents, and resubmit (which automatically resets their status to `Pending` for re-evaluation).

### 🛡️ Admin Features
* **Admin Control Panel:** Filterable dashboard to manage all applications (`All`, `Pending`, `Approved`, `Rejected`).
* **Search & Pagination:** Instant search by provider name or email.
* **Detailed Application Review:** Inspect provider profiles and preview uploaded verification documents in a clean modal.
* **Approval & Rejection:** One-click approval or rejection with mandatory feedback/remarks for the provider.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React.js (Vite)
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Authentication:** `@react-oauth/google`
* **HTTP Client:** Axios

### Backend
* **Runtime:** Node.js & Express.js
* **Database:** MongoDB & Mongoose
* **Authentication:** JWT (JSON Web Tokens) & `bcrypt`
* **OAuth:** `google-auth-library`
* **File Uploads:** Multer & ImageKit SDK

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
