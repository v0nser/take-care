// Simple placeholder pages that we reference in App.jsx

export const SignInPage = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <p>This page is now handled by our custom LoginPage component</p>
    </div>
  </div>
)

export const SignUpPage = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <p>This page is now handled by our custom RegisterPage component</p>
    </div>
  </div>
)

export const AppointmentsPage = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold mb-4">Appointments</h1>
    <p className="text-gray-600">Appointment management functionality will be implemented here</p>
  </div>
)

export const DoctorsPage = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold mb-4">Find Doctors</h1>
    <p className="text-gray-600">Doctor search and booking functionality will be implemented here</p>
  </div>
)

export const MedicalRecordsPage = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold mb-4">Medical Records</h1>
    <p className="text-gray-600">Medical records management will be implemented here</p>
  </div>
)

export const PaymentsPage = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold mb-4">Payments</h1>
    <p className="text-gray-600">Payment history and Razorpay integration will be implemented here</p>
  </div>
)

export const ProfilePage = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold mb-4">Profile</h1>
    <p className="text-gray-600">User profile management will be implemented here</p>
  </div>
)

export const VideoCallPage = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold mb-4">Video Consultation</h1>
    <p className="text-gray-600">Jitsi Meet integration for video calls will be implemented here</p>
    <div className="mt-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-8">
      <p className="text-sm text-gray-500">Video call functionality with Jitsi Meet</p>
    </div>
  </div>
)

// Additional exports for App.jsx compatibility
export const PlaceholderAppointments = AppointmentsPage
export const PlaceholderRecords = MedicalRecordsPage
export const PlaceholderPayments = PaymentsPage
export const PlaceholderProfile = ProfilePage

export const PlaceholderSettings = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold mb-4">Settings</h1>
    <p className="text-gray-600">Application settings and preferences will be implemented here</p>
  </div>
)

export const PatientsPage = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold mb-4">Patients</h1>
    <p className="text-gray-600">Patient management and records will be implemented here</p>
  </div>
)

export const SchedulePage = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold mb-4">Schedule</h1>
    <p className="text-gray-600">Calendar view and schedule management will be implemented here</p>
  </div>
)
