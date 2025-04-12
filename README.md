# 🛠️ Work Management System

This is a full-stack **Work Management System** built with the **MERN stack** (MongoDB, Express, React, Node.js). It’s designed to help teams organize their projects, assign tasks, and collaborate more effectively. 
The app features **role-based access control**, secure **session-based authentication**, **Google login**, and project-specific permission logic, all aimed at keeping things safe and efficient.

👉 **Live Demo**: [app.mybackendserver.pro](https://app.mybackendserver.pro)


---

## 🚀 Demo Accounts

Feel free to test the app using one of the following demo accounts:

Email: demouser1@myapp.com
Password: password

Email: demouser2@myapp.com
Password: password

🕒 **Note**: The app may take a few seconds to load on first visit since the backend is hosted on Render's free tier, which puts the server to sleep when idle.

## ⚙️ Tech Stack

- **Frontend**: React, Tailwind CSS, PrimeReact  
- **Backend**: Node.js, Express.js, MongoDB  
- **Authentication**: Google OAuth 2.0 & session-based login  
- **Storage**: Cloudinary (for task-related image uploads)  
- **Deployment**: Vercel (Frontend), Render (Backend)  
- **Session Management**: Secure cookies scoped to subdomains to support all major browsers (including Safari)

---

## ✨ Features

### 🔐 Authentication & Session Security
- Email/password registration & login
- Sign in with Google (OAuth2.0)
- Session-based auth stored in HTTP-only cookies
- Session cookies set to `SameSite=None` and `Secure`
- Cross-subdomain support for sessions (e.g., `app.mybackendserver.pro` + `mybackendserver.pro`)

### 👥 User Roles & Access Control
- **Owner**: Full control, can manage admins, members, and system logs  
- **Admin**: Can create projects, assign tasks, and manage users  
- **Employee**: Can view and update only their assigned tasks  

### 📁 Project Management
- Create and manage multiple projects
- Add team members to specific projects
- Assign roles to users within each project
- Only authorized users can view or manage a project

### ✅ Task Management
- Create tasks under specific projects
- Assign tasks to team members based on their roles
- Set deadlines, priorities, and descriptions
- Upload and attach **images** to tasks for clarity
- Task updates & progress tracking by assigned users

### 🧠 Admin Tools
- View all user sessions with metadata
- Remove sessions or users
- Access real-time logs for login, task, and project activity

### 🧾 Logging & Monitoring
- All critical actions are logged using Winston
- Logs are stored in MongoDB and viewable via the admin panel
- Helps monitor security and user activity

## 🌱 Future Improvements

These are some of the features I'd like to explore next:

- 💬 **Real-Time Team Chat**: WebSocket-based messaging inside project dashboards
- 🕒 **Task History & Activity Logs**: See who did what and when
- 📊 **Analytics Dashboard**: Visualize progress across multiple projects
- 🔔 **Notifications**: In-app or email alerts for task updates, deadlines, etc.
- ✅ **Drag & Drop Task Board**: Kanban-style UI for managing tasks more visually
- 🧪 **Testing & CI**: Add test coverage and deploy workflows


## 🌐 Deployment Notes

- Subdomains are used (e.g., `app.mybackendserver.pro` for frontend, `mybackendserver.pro` for backend) to **ensure session cookies** work reliably across environments — especially in Safari, which blocks third-party cookies.
- All sensitive config (API keys, database URIs, secrets, etc.) is managed using `.env` environment variables and not hardcoded.


## 💡 Notes

This project focuses on backend functionality and logic. The frontend is minimal and practical to prioritize performance and usability.  

## 📁 Local Setup

```bash
# Clone the repository
git clone https://github.com/your-username/WorkManagementSystem.git

# Install dependencies
cd client && npm install
cd ../server && npm install

# Start the servers
npm start


