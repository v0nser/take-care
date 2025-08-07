# TakeCare - Quick Start Guide 🚀

## 🎯 Overview
Your appointment booking system is now ready with sample data! Follow this guide to test all the features.

## ✅ Prerequisites
- Backend server running on port 5000
- Frontend running on port 5173
- Database seeded with sample data

## 🔑 Sample Login Credentials

### Admin Access
- **Email:** `admin@takecare.com`
- **Password:** `admin123`

### Sample Doctors
All doctors use password: `password123`

1. **Dr. Sarah Wilson** (Cardiology)
   - Email: `dr.sarah.wilson@takecare.com`
   - Available: Mon, Wed, Fri (9 AM - 5 PM)

2. **Dr. Michael Chen** (Dermatology)
   - Email: `dr.michael.chen@takecare.com`
   - Available: Tue, Thu, Sat (10 AM - 6 PM)

3. **Dr. Priya Sharma** (Pediatrics)
   - Email: `dr.priya.sharma@takecare.com`
   - Available: Mon-Fri (8 AM - 4 PM)

4. **Dr. James Rodriguez** (Orthopedics)
   - Email: `dr.james.rodriguez@takecare.com`
   - Available: Mon, Wed, Fri (11 AM - 7 PM)

5. **Dr. Emily Johnson** (Psychiatry)
   - Email: `dr.emily.johnson@takecare.com`
   - Available: Tue-Sat (12 PM - 8 PM)

6. **Dr. David Kim** (General Medicine)
   - Email: `dr.david.kim@takecare.com`
   - Available: Mon-Fri (7 AM - 3 PM)

### Sample Patients
All patients use password: `password123`

1. **John Doe**
   - Email: `john.doe@email.com`

2. **Alice Smith**
   - Email: `alice.smith@email.com`

3. **Robert Brown**
   - Email: `robert.brown@email.com`

## 🧪 Testing the Appointment System

### Part 1: Patient Journey (Book an Appointment)

1. **Login as Patient**
   - Go to `http://localhost:5173/login`
   - Use John Doe credentials: `john.doe@email.com` / `password123`

2. **Book an Appointment**
   - Click "Book Appointment" from dashboard
   - Or go directly to: `http://localhost:5173/appointments/book`

3. **Select a Doctor**
   - Browse available doctors
   - Use filters by specialization
   - Search by name
   - Select Dr. Sarah Wilson (Cardiology)

4. **Choose Date & Time**
   - Navigate to an available date (Monday, Wednesday, or Friday)
   - Select an available time slot
   - Confirm selection

5. **Fill Booking Details**
   - Reason: "Chest pain and palpitations"
   - Symptoms: "chest pain, shortness of breath"
   - Type: Consultation
   - Submit booking

6. **Confirmation**
   - View appointment confirmation
   - Note: Status will be "Pending Approval"

### Part 2: Doctor Journey (Manage Appointments)

1. **Logout and Login as Doctor**
   - Logout from patient account
   - Login as Dr. Sarah Wilson: `dr.sarah.wilson@takecare.com` / `password123`

2. **View Appointment Requests**
   - Go to "Appointment Management" from dashboard
   - Or navigate to: `http://localhost:5173/appointments/manage`

3. **Accept the Appointment**
   - Click on the pending appointment
   - Click "Accept" button
   - Add notes (optional)
   - Confirm acceptance

4. **Notice Jitsi Meeting Link**
   - After acceptance, a unique Jitsi Meet link is generated
   - Both doctor and patient can now join the video call

### Part 3: Doctor Availability Management

1. **Set Availability** (while logged in as doctor)
   - Go to "Manage Availability" from dashboard
   - Or navigate to: `http://localhost:5173/availability`

2. **Configure Weekly Schedule**
   - Toggle days on/off
   - Set working hours
   - Generate time slots
   - Save changes

3. **Block Specific Dates**
   - Go to "Blocked Dates" tab
   - Add holiday or unavailable dates
   - Set reason for blocking

4. **Adjust Settings**
   - Go to "Settings" tab
   - Configure slot duration (15, 30, 45, 60 minutes)
   - Set buffer time between appointments
   - Set maximum advance booking days

### Part 4: Video Consultation

1. **Join Video Call** (after appointment is confirmed)
   - Login as patient or doctor
   - Find the confirmed appointment
   - Click "Join Video Call" button
   - Jitsi Meet will open in new tab

2. **Complete Consultation** (as doctor)
   - During or after the call
   - Click "Complete Consultation"
   - Add diagnosis and prescription
   - Save completion details

## 🎮 Testing Different Scenarios

### Scenario 1: Same-day Booking Prevention
- Try booking an appointment for today or past dates
- System should prevent booking

### Scenario 2: Double Booking Prevention
- Book multiple appointments for the same time slot
- Second booking should fail

### Scenario 3: Doctor Unavailable
- Try booking when doctor has no availability set
- Should show "not available"

### Scenario 4: Filter and Search
- Test doctor search by name
- Filter by different specializations
- Verify results update correctly

### Scenario 5: Appointment Status Flow
1. Patient books → Status: "Pending"
2. Doctor accepts → Status: "Confirmed" + Jitsi link generated
3. Doctor completes → Status: "Completed" + diagnosis saved
4. Anyone cancels → Status: "Cancelled" + reason required

## 🔧 Development Tools

### Database Seeder
- Visit: `http://localhost:5173/dev/seed`
- Reset and repopulate database with fresh sample data
- Useful for testing different scenarios

### API Testing
- Check seed status: `GET http://localhost:5000/api/seed/status`
- Reseed database: `POST http://localhost:5000/api/seed/database`

## 📱 Mobile Testing
- The interface is fully responsive
- Test on different screen sizes
- All features work on mobile devices

## 🚨 Troubleshooting

### Common Issues:

1. **No doctors showing up**
   - Ensure database is seeded
   - Check if doctors have availability set

2. **Can't book appointments**
   - Verify doctor has available time slots
   - Check if trying to book past dates

3. **Video call not working**
   - Ensure appointment is confirmed
   - Check browser permissions for camera/microphone

4. **Backend errors**
   - Check MongoDB connection
   - Verify all environment variables are set

### Debug Steps:
1. Check browser console for JavaScript errors
2. Check backend logs for API errors
3. Verify database connections
4. Test API endpoints directly

## 🎉 Success Indicators

You've successfully tested the system when you can:
- ✅ Login as different user types
- ✅ Book appointments as patients
- ✅ Manage availability as doctors
- ✅ Accept/reject appointments as doctors
- ✅ Generate and access video meeting links
- ✅ Complete consultations with prescriptions
- ✅ Filter and search functionality works
- ✅ Real-time updates work properly

## 🔄 Reset for Fresh Testing
- Visit `/dev/seed` page
- Click "Seed Database" to start fresh
- All data will be reset to initial state

---

## 🎯 Next Steps

After testing, you can:
1. Add more doctors and specializations
2. Configure payment integration
3. Set up email notifications
4. Add SMS reminders
5. Integrate with external calendar systems

**Happy Testing! 🚀** 