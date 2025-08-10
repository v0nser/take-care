import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SocketProvider } from './contexts/SocketContext';
import { ApiProvider, useApi } from './contexts/ApiContext';

// Layouts
import PublicLayout from './components/layouts/PublicLayout';
import DashboardLayout from './components/layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import RoleSelection from './components/auth/RoleSelection';

// Dashboard Pages
import PatientDashboard from './pages/dashboards/PatientDashboard';
import DoctorDashboard from './pages/dashboards/DoctorDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

// Settings Page
import SettingsPage from './pages/SettingsPage';

// Appointment Pages
import AppointmentBookingPage from './pages/AppointmentBookingPage';
import DoctorAvailabilityPage from './pages/DoctorAvailabilityPage';
import AppointmentManagementPage from './pages/AppointmentManagementPage';
import AppointmentsPage from './pages/AppointmentsPage';

// Development Tools
import DatabaseSeederPage from './pages/DatabaseSeederPage';
import ConnectionTestPage from './pages/ConnectionTestPage';

// Placeholder Pages
import { 
  PlaceholderAppointments, 
  PlaceholderRecords, 
  PlaceholderPayments, 
  PlaceholderProfile,
  DoctorsPage,
  PatientsPage,
  SchedulePage
} from './pages/PlaceholderPages';

// Services Pages
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';

// Teleconsultation
import TeleconsultationInterface from './components/appointments/TeleconsultationInterface';

// Auth-specific App component
const AppContent = () => {
  const { isSignedIn, user, isLoaded, userRole } = useAuth();

  console.log('🔍 App state:', { 
    isSignedIn, 
    user: user ? { id: user.id, role: user.role, email: user.email } : null, 
    isLoaded, 
    userRole 
  });

  // Show loading spinner while auth is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Helper function to get dashboard path based on role
  const getDashboardPath = () => {
    switch (userRole) {
      case 'doctor': return '/dashboard/doctor';
      case 'admin': return '/dashboard/admin';
      case 'patient':
      default: return '/dashboard/patient';
    }
  };

  return (
    <div className="App">
      <Routes>
        {isSignedIn ? (
          <>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Navigate to={getDashboardPath()} replace />} />
              
              {/* Patient Dashboard */}
              <Route path="patient" element={<PatientDashboard />} />
              
              {/* Doctor Dashboard */}
              <Route path="doctor" element={<DoctorDashboard />} />
              
              {/* Admin Dashboard */}
              <Route path="admin" element={<AdminDashboard />} />
              
              {/* Common Dashboard Pages */}
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="appointments/book" element={<AppointmentBookingPage />} />
              <Route path="appointments/manage" element={<AppointmentManagementPage />} />
              <Route path="doctors" element={<DoctorsPage />} />
              <Route path="patients" element={<PatientsPage />} />
              <Route path="schedule" element={<SchedulePage />} />
              <Route path="records" element={<PlaceholderRecords />} />
              <Route path="payments" element={<PlaceholderPayments />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="profile" element={<PlaceholderProfile />} />
              <Route path="availability" element={<DoctorAvailabilityPage />} />
              
              {/* Services within dashboard - with navigation */}
              <Route path="services" element={<ServicesPage />} />
              <Route path="services/:specialtyId" element={<ServiceDetailPage />} />
            </Route>
            
            {/* Teleconsultation Route - Outside dashboard layout for full-screen */}
            <Route path="/teleconsultation/:appointmentId" element={<TeleconsultationInterface />} />
            
            <Route path="/role-selection" element={<RoleSelection />} />
            
            {/* Development tools */}
            <Route path="/dev/seed" element={<DatabaseSeederPage />} />
            <Route path="/dev/connection" element={<ConnectionTestPage />} />
            
            <Route path="/*" element={
              !userRole ? 
              <Navigate to="/role-selection" replace /> : 
              <Navigate to={getDashboardPath()} replace />
            } />
          </>
        ) : (
          <>
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>
            
            {/* Services routes - accessible to unauthenticated users */}
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:specialtyId" element={<ServiceDetailPage />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <ApiProvider>
            <SocketProvider>
              <AppContent />
            </SocketProvider>
          </ApiProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
