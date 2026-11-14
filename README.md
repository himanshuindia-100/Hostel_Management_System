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
│   ├── Route/                  # Express API routes
│   ├── controller/             # Request handlers and business logic
│   ├── model/                  # Mongoose schemas
│   ├── middleware/             # JWT authentication middleware
│   ├── congig/db.js            # MongoDB connection (directory name is "congig")
│   ├── app.js                  # Backend entry point
│   ├── package.json
│   └── .env.example
│
└── Hoste_frontend-main/
    ├── public/
    ├── src/
    │   ├── api/                # Backend base URL
    │   ├── components/         # Shared UI and complaint/announcement components
    │   ├── contex/             # Login context
    │   ├── pages/              # Student/admin pages
    │   ├── App.js              # Frontend routes and login state
    │   └── index.js            # React entry point
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
cd Hoste_Backend-main
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
cd Hoste_frontend-main
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

## Backend API overview

All paths below are relative to `http://localhost:4000`.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/route/signup-request` | Request registration and send an OTP |
| POST | `/route/verify-register` | Verify the OTP and create the account |
| POST | `/route/login` | Authenticate a student or administrator |
| POST | `/route/complain` | Submit a student complaint |
| GET | `/route/get/mycomplain` | Get the logged-in student's complaints |
| GET | `/route/student_status` | Get the student's complaint totals |
| GET | `/route/get/annoucment` | List announcements |
| GET | `/route/admin/get/all_complain` | List complaints for administrators |
| PUT | `/route/admin/update/:complainId/:elementId` | Mark a complaint as resolved |
| DELETE | `/route/delete/complain/:complainId/:elementId` | Delete a complaint |
| GET | `/route/admin/total_student` | Get the registered student count |
| GET | `/route/admin/total_status` | Get global complaint statistics |
| GET | `/route/admin/student_detail` | List student details |
| DELETE | `/route/admin/delete_user/:studentId` | Delete a student account |
| POST | `/route/admin/add_annoucement` | Publish an announcement |

Most student/admin data endpoints require an `Authorization: Bearer <token>` header. Administrator operations also check the authenticated user's role.

## How the code is organized

- `Hoste_frontend-main/src/App.js` declares the React pages and shares login-state setters through `LoginContext`.
- `Hoste_frontend-main/src/api/config.js` defines the API base URL used by frontend requests.
- `Hoste_Backend-main/app.js` creates the Express app, enables JSON and CORS middleware, connects to MongoDB, and mounts `Route/route.js` at `/route`.
- `Hoste_Backend-main/Route/route.js` maps HTTP methods and URL paths to controller functions.
- `Hoste_Backend-main/middleware/middle.js` verifies the JWT and loads the current user from MongoDB into `req.user`.
- `Hoste_Backend-main/controller/` contains authentication, complaint, announcement, and student-management logic.
- `Hoste_Backend-main/model/` defines the user, complaint, and announcement collections.

## Troubleshooting

- **MongoDB connection fails:** Confirm the MongoDB service is running, check `DATABASE_URL`, and verify Atlas network access if using Atlas.
- **Browser shows a network or CORS error:** Start the backend first and confirm it is listening on port `4000`. Check `Hoste_frontend-main/src/api/config.js`.
- **OTP emails are not sent:** Check `EMAIL_USER` and `EMAIL_PASS`. Use a Google App Password and make sure the mail account permits SMTP access.
- **The frontend starts but API requests fail:** Check the backend terminal for errors and confirm the request URL begins with `http://localhost:4000/route`.
- **An OTP stops working after restarting the backend:** Pending OTP data is currently stored in an in-memory JavaScript `Map`; restarting the process clears pending registrations.

## Security notes

- Never commit your real `.env` file, database credentials, JWT secret, or email app password.
- An SMTP app password was previously committed in the repository's history. Revoke it in the Google Account that issued it; changing the source file alone does not invalidate the exposed credential. Use a newly generated App Password in your local `.env`.
- The current registration flow accepts the `student` and `admin` roles from the public signup request. Restrict administrator account creation before deploying this application publicly.
- The OTP store is in memory and is suitable only for simple local development. A persistent, rate-limited OTP store is needed for a production deployment.
- Configure the Cloudinary cloud name and unsigned upload preset in `src/components/Register_complain.js` before relying on complaint image uploads.

## Notes

- The backend folder is currently named `Hoste_Backend-main`, and its MongoDB configuration directory is spelled `congig`. Keep these names as-is unless you also update the corresponding import paths.
- The existing frontend README was the unmodified Create React App template; this root README documents the full-stack project.
