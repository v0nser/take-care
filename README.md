# TakeCare Healthcare Platform

A comprehensive healthcare management system with real-time search functionality, appointment booking, and telemedicine capabilities.

## 🚀 Features

- **Advanced Search System**: Search across users, appointments, medical records, payments, and activity logs
- **Real-time Updates**: Socket.IO integration for live notifications and updates
- **Role-based Access**: Separate portals for patients, doctors, and administrators
- **Telemedicine**: Built-in video consultation system
- **Comprehensive Dashboard**: Complete healthcare management interface

## 🛠️ Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Socket.IO for real-time communication
- JWT authentication
- Razorpay payment integration

### Frontend
- React with modern hooks
- Tailwind CSS for styling
- React Router for navigation
- Context API for state management

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd takecare-healthcare
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/takecare
JWT_SECRET=your_jwt_secret_here
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 4. Database Seeding
Seed the database with comprehensive sample data:
```bash
npm run seed
```

This will create:
- 24 doctors across all medical specialties
- 5 patients with sample data
- Sample appointments, medical records, payments, and activity logs
- Complete search functionality data

### 5. Start Backend Server
```bash
npm run dev
```

### 6. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

## 🔍 Search Functionality

The platform includes a powerful search system that allows users to search across:

### Searchable Content Types
- **Users**: Doctors, patients, and staff members
- **Appointments**: Consultation details, symptoms, and diagnoses
- **Medical Records**: Patient history, prescriptions, and test results
- **Payments**: Transaction records and payment status
- **Activity Logs**: System activities and user actions

### Search Features
- **Real-time Search**: Instant results as you type
- **Smart Suggestions**: Autocomplete with relevant options
- **Advanced Filtering**: Filter by content type and role
- **Keyboard Navigation**: Full keyboard support for accessibility
- **Role-based Results**: Users only see data they're authorized to access

### Search Examples
```
# Search for doctors
"cardiology" → Dr. Sarah Wilson (Cardiology)
"dermatology" → Dr. Michael Chen (Dermatology)

# Search for symptoms
"chest pain" → Cardiac evaluation appointments
"skin rash" → Dermatological consultations

# Search for medications
"Metoprolol" → Cardiac prescriptions
"Sertraline" → Psychiatric medications

# Search for conditions
"diabetes" → Diabetology consultations
"anxiety" → Psychiatric evaluations
```

## 👥 User Roles & Access

### Patient Portal
- Search for doctors by specialty
- View own appointments and medical records
- Access personal payment history
- Book and manage consultations

### Doctor Portal
- Search for patients and colleagues
- Access patient medical records
- View appointment schedules
- Manage consultation notes

### Admin Portal
- Full system access
- Search across all data types
- View activity logs and system metrics
- Manage users and permissions

## 🗄️ Database Schema

### Core Models
- **User**: Patients, doctors, and administrators
- **Appointment**: Consultation scheduling and management
- **MedicalRecord**: Patient health records and prescriptions
- **Payment**: Financial transactions and billing
- **ActivityLog**: System activity tracking
- **DoctorAvailability**: Scheduling and availability management

### Sample Data Structure
```javascript
// Example Medical Record
{
  patient: ObjectId,
  doctor: ObjectId,
  recordType: 'consultation',
  title: 'Cardiac Evaluation Report',
  description: 'Comprehensive cardiac assessment',
  symptoms: [
    { symptom: 'chest pain', severity: 'moderate', duration: '1 week' }
  ],
  diagnosis: [
    { condition: 'Atrial fibrillation', severity: 'moderate' }
  ],
  prescription: [
    { medicine: 'Metoprolol', dosage: '25mg', frequency: 'Twice daily' }
  ]
}
```

## 🔐 Authentication & Security

- JWT-based authentication
- Role-based access control
- Secure password hashing with bcrypt
- CORS protection
- Input validation and sanitization

## 📱 Real-time Features

- Live appointment notifications
- Real-time chat during consultations
- Instant search results
- Live status updates

## 🧪 Testing the Search

### 1. Login as Different Users
```bash
# Admin
Email: admin@takecare.com
Password: admin123

# Doctor
Email: dr.sarah.wilson@takecare.com
Password: password123

# Patient
Email: john.doe@email.com
Password: password123
```

### 2. Test Search Functionality
- Use the search bar in the top navigation
- Try different search terms:
  - Doctor names and specializations
  - Medical conditions and symptoms
  - Medication names
  - Appointment types

### 3. Test Filters
- Filter by content type (users, appointments, records, etc.)
- Use role-based filtering
- Test keyboard navigation

## 🚨 Troubleshooting

### Common Issues

#### Search Not Working
1. Ensure database is seeded: `npm run seed`
2. Check MongoDB connection
3. Verify search routes are accessible

#### No Results Found
1. Check if sample data exists
2. Verify user permissions
3. Check search query length (minimum 2 characters)

#### Database Connection Issues
1. Verify MongoDB is running
2. Check connection string in `.env`
3. Ensure database exists

### Debug Mode
Enable debug logging in the backend:
```env
DEBUG=app:*
NODE_ENV=development
```

## 📚 API Documentation

### Search Endpoints
- `GET /api/search` - Main search functionality
- `GET /api/search/suggestions` - Search suggestions/autocomplete

### Search Parameters
- `query`: Search term (minimum 2 characters)
- `type`: Content type filter (users, appointments, records, payments, logs)
- `role`: User role filter
- `page`: Pagination (default: 1)
- `limit`: Results per page (default: 20)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Updates

### Recent Changes
- Enhanced search functionality with comprehensive data
- Added medical records, payments, and activity logs
- Improved search suggestions and filtering
- Better keyboard navigation support

### Planned Features
- Advanced search analytics
- Search result highlighting
- Export search results
- Search history and favorites

---

**Note**: This is a development version. For production use, ensure proper security measures, environment configuration, and data validation.
