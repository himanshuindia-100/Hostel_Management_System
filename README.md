# Hostel Management System

A full-stack hostel portal with separate student and administrator experiences. Students can register and log in, raise hostel complaints, and track their status. Administrators can review complaints, update their status, manage student records, and publish announcements.

## Technology stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, React Router, Tailwind CSS, Framer Motion, React Toastify |
| Backend | Node.js, Express 4 |
| Database | MongoDB with Mongoose |
| Authentication | JSON Web Tokens (JWT), bcrypt password hashing |
| Email | Nodemailer with Gmail SMTP |
| Complaint images | Cloudinary unsigned image uploads |

## Repository structure

```text
Hostel_Management_System/
├── Hoste_Backend-main/
│   └── Hoste_Backend-main/
│       ├── Route/              # Express API routes
│       ├── controller/         # Request handlers and business logic
│       ├── model/              # Mongoose schemas
│       ├── middleware/         # JWT authentication middleware
│       ├── congig/db.js        # MongoDB connection (directory name is "congig")
│       ├── app.js              # Backend entry point
│       ├── package.json
│       └── .env.example
│
└── Hoste_frontend-main/
    └── Hoste_frontend-main/
        ├── public/
        ├── src/
        │   ├── api/            # Backend base URL
        │   ├── components/     # Shared UI and complaint/announcement components
        │   ├── contex/         # Login context
        │   ├── pages/          # Student/admin pages
        │   ├── App.js          # Frontend routes and login state
        │   └── index.js        # React entry point
        └── package.json
```

The frontend and backend are independent Node.js projects. Install dependencies and run them in separate terminal windows.

## Prerequisites

Install the following before starting:

- [Node.js](https://nodejs.org/) (18 or later) and npm.
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally, or a MongoDB Atlas connection string.
- A Gmail account with 2-Step Verification and a Google App Password, if you want to test OTP registration and announcement email notifications.
- A Cloudinary account and an unsigned upload preset, if you want complaint image uploads to work.

## Run locally

### 1. Clone the repository

```bash
git clone https://github.com/himanshuindia-100/Hostel_Management_System.git
cd Hostel_Management_System
```

### 2. Configure and start the backend

Open a terminal in the repository root:

```bash
cd Hoste_Backend-main/Hoste_Backend-main
npm ci
```

Create your local environment file by copying the example:

**Windows PowerShell**
```powershell
Copy-Item .env.example .env
```

**macOS / Linux**
```bash
cp .env.example .env
```

Edit `.env` and provide your own values:

| Variable | Purpose |
|---|---|
| `PORT` | Backend port. Use `4000` to match the frontend's configured API URL. |
| `DATABASE_URL` | MongoDB connection string. |
| `JWT_URL` | A long, random secret used to sign and verify login tokens. |
| `EMAIL_USER` | Gmail address used by Nodemailer. |
| `EMAIL_PASS` | Google App Password for that Gmail account (not your normal Gmail password). |

For a local MongoDB instance, the default database URL is:

```env
DATABASE_URL=mongodb://127.0.0.1:27017/hostel_management
```

For MongoDB Atlas, use the connection string provided by your Atlas cluster instead. Make sure the database user and Network Access settings permit your connection.

Start the backend:

```bash
npm run dev
```

The backend listens at `http://localhost:4000`. Its root route, `http://localhost:4000/`, returns a simple homepage response. API endpoints are mounted under `/route`.

### 3. Configure and start the frontend

Open a **second** terminal window at the repository root:

```bash
cd Hoste_frontend-main/Hoste_frontend-main
npm ci
npm start
```

The React development server opens at:

[http://localhost:3000](http://localhost:3000)

The frontend API base URL is configured in `src/api/config.js` as `http://localhost:4000/route`. Keep the backend on port `4000`, or update that value if you choose a different backend port.

## Main application flows

### Student

1. Register with student details.
2. Verify the one-time password (OTP) sent to the registered email.
3. Log in and open the student dashboard.
4. Submit a complaint, optionally attaching an image.
5. View submitted complaints and their pending/resolved status.
6. Read hostel announcements.

### Administrator

1. Log in with an administrator account.
2. View the dashboard summary (student and complaint counts).
3. Review complaints and mark them resolved.
4. View student details and remove a student account.
5. Publish announcements. The backend also sends announcement emails to registered students.
