# Multi-Instance TakeCare Setup Guide

This guide explains how to run **multiple instances** of the **same TakeCare application** for testing different user roles (doctor, patient, admin) simultaneously. This is NOT multiple different apps - it's the same RBAC application running on different ports with isolated socket connections.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Single Backend Server                        │
│                        Port: 5000                              │
│                    (Shared by all instances)                   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ API Calls
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Instance 1     │    │  Instance 2     │    │  Instance 3     │
│  Port: 5173     │    │  Port: 5174     │    │  Port: 5175     │
│  ID: doctor     │    │  ID: patient    │    │  ID: admin      │
│  (Same App)     │    │  (Same App)     │    │  (Same App)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
                    Isolated Socket Connections
                    (No conflicts between instances)
```

## 🎯 What This Solves

- ✅ **Test Multiple User Roles**: Log in as doctor, patient, and admin simultaneously
- ✅ **Isolated Socket Connections**: Each instance has its own real-time connection
- ✅ **Shared Backend**: All instances use the same database and API
- ✅ **No Code Duplication**: Single codebase, multiple running instances
- ✅ **Real-time Testing**: Test notifications, appointments, etc. across roles

## 🚀 Quick Start

### Prerequisites
1. **Backend must be running** on port 5000
2. Install dependencies: `npm install`

### Option 1: Run All Instances at Once (Recommended)

#### Linux/Mac:
```bash
./run-multi-instances.sh
```

#### Windows:
```bash
run-multi-instances.bat
```

### Option 2: Run Instances Individually

```bash
# Terminal 1 - Doctor Portal
npm run dev:doctor

# Terminal 2 - Patient Portal  
npm run dev:patient

# Terminal 3 - Admin Portal
npm run dev:admin
```

### Option 3: Using Concurrently
```bash
npm run dev:all
```

## 🌐 Access URLs

- **👨‍⚕️ Doctor Portal**: http://localhost:5173
- **👤 Patient Portal**: http://localhost:5174  
- **👨‍💼 Admin Portal**: http://localhost:5175
- **🔧 Backend API**: http://localhost:5000

## 🔧 How It Works

### 1. **Instance Identification**
Each instance gets a unique identifier:
- `INSTANCE_ID`: doctor, patient, admin
- `PORT`: 5173, 5174, 5175
- These are embedded in the Vite build and available to your React app

### 2. **Socket Isolation**
- Each instance creates socket connections with unique instance IDs
- Backend creates instance-specific rooms: `user_123_doctor`, `user_123_patient`
- No socket conflicts between instances
- Real-time updates work independently per instance

### 3. **Shared Backend**
- All instances make API calls to the same backend (port 5000)
- Same database, same business logic
- Data changes in one instance are visible in others

### 4. **RBAC Testing**
- Log in as different user types in each instance
- Test role-specific features simultaneously
- Verify permissions and access controls

## 📱 Testing Scenarios

### **Scenario 1: Doctor-Patient Interaction**
1. **Instance 1 (Port 5173)**: Log in as a doctor
2. **Instance 2 (Port 5174)**: Log in as a patient
3. **Test**: Doctor creates appointment → Patient receives notification
4. **Result**: Real-time updates work in both instances

### **Scenario 2: Admin Monitoring**
1. **Instance 1 (Port 5173)**: Doctor performing actions
2. **Instance 2 (Port 5174)**: Patient performing actions  
3. **Instance 3 (Port 5175)**: Admin monitoring both
4. **Test**: Admin sees real-time logs from both instances

### **Scenario 3: Multi-User Chat/Notifications**
1. **All Instances**: Different users logged in
2. **Test**: Send notifications, chat messages, updates
3. **Result**: Each instance receives updates independently

## ⚙️ Configuration Files

- `vite.config.multi.js` - Multi-instance configuration
- `run-multi-instances.sh` - Linux/Mac runner script
- `run-multi-instances.bat` - Windows runner script

## 📝 Available Scripts

```json
{
  "dev": "vite",                                    // Default dev server
  "dev:multi": "vite --config vite.config.multi.js", // Multi-instance config
  "dev:doctor": "INSTANCE_ID=doctor PORT=5173 vite --config vite.config.multi.js",
  "dev:patient": "INSTANCE_ID=patient PORT=5174 vite --config vite.config.multi.js", 
  "dev:admin": "INSTANCE_ID=admin PORT=5175 vite --config vite.config.multi.js",
  "dev:all": "concurrently \"npm run dev:doctor\" \"npm run dev:patient\" \"npm run dev:admin\""
}
```

## 🔌 Socket Features

### **Instance-Specific Rooms**
- `user_{userId}_{instanceId}` - User's personal room per instance
- `doctor_{doctorId}_{instanceId}` - Doctor's room per instance
- No conflicts between instances

### **Real-time Events**
- ✅ New appointments
- ✅ Appointment updates
- ✅ Payment notifications
- ✅ Meeting notifications
- ✅ Medical record updates
- ✅ Admin broadcasts

### **Connection Management**
- Automatic reconnection on network issues
- Instance-aware error handling
- Clean disconnection per instance

## 🚨 Troubleshooting

### **Port Already in Use**
```bash
# Find processes using ports
lsof -i :5173
lsof -i :5174  
lsof -i :5175

# Kill processes
kill -9 <PID>
```

### **Socket Connection Issues**
- Ensure backend is running on port 5000
- Check browser console for socket errors
- Verify instance IDs are unique
- Check network connectivity

### **Backend Health Check**
```bash
curl http://localhost:5000/api/health
```

### **Instance Conflicts**
- Each instance must have unique `INSTANCE_ID` and `PORT`
- Don't run the same instance twice
- Use the provided scripts to avoid conflicts

## 🔄 Development Workflow

1. **Start Backend**: `cd backend && npm start`
2. **Start Instances**: `./run-multi-instances.sh`
3. **Test Roles**: Log in with different accounts in each instance
4. **Develop**: Make changes to your React components
5. **Hot Reload**: All instances update independently

## 📊 Monitoring

### **Backend Console**
```
🔌 Socket auth: doctor@example.com (doctor) - Instance: doctor, Port: 5173
✅ User connected: doctor@example.com (doctor) - Instance: doctor, Port: 5173, Socket: abc123
User 123 joined instance room: user_123_doctor
```

### **Frontend Console**
Each instance shows its unique identifier:
```
🚀 Starting TakeCare instance: doctor on port 5173
🔌 Socket connected with instance: doctor
```

## 🎯 Best Practices

1. **Use Different Browsers/Tabs**: Keep instances visually separate
2. **Unique User Accounts**: Test with different login credentials
3. **Monitor Console**: Watch for instance-specific logs
4. **Clean Shutdown**: Use Ctrl+C to stop all instances cleanly
5. **Backend First**: Always start backend before instances

## 🚀 Production Considerations

- This setup is for **development and testing only**
- Production should use proper load balancing
- Consider using subdomains for different user types
- Implement proper session management for production

## 🔗 Related Files

- `src/contexts/SocketContext.jsx` - Socket management with instance awareness
- `backend/server.js` - Backend with multi-instance socket support
- `vite.config.multi.js` - Multi-instance Vite configuration
- `run-multi-instances.sh` - Linux/Mac runner script
- `run-multi-instances.bat` - Windows runner script 