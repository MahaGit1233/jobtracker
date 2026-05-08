# Job Application Tracker

Job Application Tracker is a web application that helps users organize and manage their job search in one place. It allows users to keep track of their applications, companies, and progress throughout the hiring process with a clean and structured interface.
The frontend is built with **React** and the backend uses **Node.js**, **Express**, **MySQL**.

## Features

- Secure user authentication for login and access control
- Job application tracking and management system
- Company-wise application organization
- Deadline and interview tracking
- Email reminders for important dates
- User profile management page
- Dashboard with job search analytics and statistics
- Pagination for smooth data navigation
- Light and dark theme support
- Responsive and user-friendly interface

## Branches in Git

main: backend(Node.js, Express, MySQL)
master: frontend(React)

## Tech Stack

### Frontend

- React
- React Bootstrap
- React-router-dom
- Recharts (for charts)
- React bootstrap icons

### Backend

- Node.js & Express
- MySQL (via sequelize ORM)
- JWT Authentication
- Sendinblue API for emails

### Other tools

- Git & Github (for version control)
- Postman (for API testing)
- dotenv (for environment variables)

## Project Structure

### Frontend (`master` branch)

src/
├─ components/
│ ├─ context/ # page related to the storing of theme
│ ├─ register/ # pages related to authentication 
│ ├─ applicationLayout/ # page related to the layout of the application
│ ├─ companyForm/ # page related to adding a company in the application
│ ├─ dashborad/ # page related to the dashboard of the application
│ ├─ jobApplicationForm/ # page related to adding a job in the application
│ ├─ profile/ # page related to profile
│ ├─ profileForm/ # page related to adding the profile
│ ├─ sidebar/ # page related to the sidebar operation
│ ├─ tracker/ # page where users can track their applications

### Backend (`main` branch)

backend/
├── controllers/ # pages related to business logic
├── cron/ # pages related to the notification users gets
├── middleware/ # Authentication and other middleware
├── modals/ # pages related to database models
├── routes/ # pages related to API routes
├── utils/ # utilities (e.g., DB connection)
└── app.js/ # backend entry point

## Installation & Setup

### Frontend (`master` branch)

npm install
npm start

### Backend (`main` branch)

npm install
node app.js (or nodemon app.js)

Set up environment variables in a .env file:

- API_KEY=API_KEY
- TOKEN=your token
- DB_NAME=your db_name
- DB_PASSWORD=your db_password
- DB_HOST=localhost
- DB_USER=root
- DB_PORT=your db_port
- EMAIL=your sender/admin_email
- PORT=your port

## Usage

- Sign up and log in securely to access your dashboard.
- Add new job applications with company and role details.
- Track the status of each application (applied, interview, offer, etc).
- Set deadlines and manage interview schedules.
- View all applications in a paginated list.
- Receive email reminders for important dates.
- Update and manage your personal profile information.
- View analytics to understand your job search progress.
- Switch between light and dark themes based on preference
- Edit or remove existing job application as needed.