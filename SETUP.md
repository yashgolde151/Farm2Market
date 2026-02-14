# Farm2Market Server Setup Instructions

## 🚀 Quick Start

### 1. Install Node.js
Download and install Node.js from: https://nodejs.org/
(Choose LTS version)

### 2. Install Dependencies
Open Command Prompt/Terminal in the project folder and run:
```bash
npm install
```

### 3. Start the Server
```bash
npm start
```

### 4. Access the Application
- **Main Website:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin

## 📋 Admin Login Details
- **Username:** admin
- **Password:** farm2market@2026

## 🔧 Development Mode
For auto-restart on file changes:
```bash
npm run dev
```

## 📁 Data Storage
- User data: `data/users.json`
- Document data: `data/documents.json`

## 🌐 How It Works
1. **Registration:** Users register → Data saved to server + localStorage
2. **Document Upload:** Files uploaded → Stored on server + localStorage  
3. **Admin Review:** Admin approves/rejects → Updates server + localStorage
4. **Real-time Sync:** Both websites sync with server every 2 seconds

## 🔄 Testing the System
1. Start server: `npm start`
2. Register a user at: http://localhost:3000/register.html
3. Upload documents at: http://localhost:3000/verification.html
4. Check admin panel at: http://localhost:3000/admin
5. Login with admin credentials
6. Review and approve/reject documents

## 📊 Features
- ✅ Real-time data synchronization
- ✅ Server + localStorage backup
- ✅ File upload with 1MB limit
- ✅ Document approval workflow
- ✅ Separate farmer/buyer sections
- ✅ Export functionality
- ✅ Auto-refresh every 30 seconds

## 🛠️ Troubleshooting
- If server fails, system falls back to localStorage
- Data persists in JSON files
- Check console for error messages
- Ensure port 3000 is available