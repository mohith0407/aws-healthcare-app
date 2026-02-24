// src/App.jsx
import { Suspense, lazy } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ProtectedRoute from './components/utils/ProtectedRoute';
import DashboardLayout from './components/templates/DashboardLayout';
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { useEffect } from 'react';
// import  from './pages/patient/MyAppointments';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));

const BookAppointment = lazy(() => import('./pages/patient/BookAppointment'));
const MyAppointments = lazy(() => import('./pages/patient/MyAppointments'));
// Lazy Load Dashboards
const AdminDashboard = lazy(() => import('./pages/dashboards/AdminDashboard'));
const DoctorDashboard = lazy(() => import('./pages/dashboards/DoctorDashboard'));
const PatientDashboard = lazy(() => import('./pages/dashboards/PatientDashboard'));
// Reusable Loader
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen text-primary">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Define the Traffic Controller Logic
    const checkUserAndRedirect = async () => {
      try {
        // Check if user is logged in
        await getCurrentUser();
        
        // Get their profile details (Role)
        const attributes = await fetchUserAttributes();
        const role = attributes['custom:role'];

        console.log("User detected. Role:", role);

        // --- THE REDIRECT LOGIC ---
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else if (role === 'doctor') {
          navigate('/doctor/dashboard');
        } else {
          // If role is undefined (Google User) or 'patient'
          navigate('/patient/dashboard');
        }
      } catch (err) {
        // User is not logged in, do nothing (stay on landing/login page)
        console.log("User not logged in yet");
      }
    };

    // 2. Listen for "SignIn" events (Triggers after Google Redirect)
    const hubListener = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signedIn') {
        checkUserAndRedirect();
      }
    });

    // 3. Also check on initial App Load (in case they refresh the page)
    checkUserAndRedirect();

    // Cleanup listener
    return () => hubListener();
  }, [navigate]);
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* --- PROTECTED ROUTES --- */}
        {/* We wrap all dashboards in this Guard */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'patient']} />}>
            
            {/* The Layout (Sidebar/Header) applies to all nested routes */}
            <Route element={<DashboardLayout />}>
              
              {/* Role Specific Access */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
                <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
                <Route path="/patient/dashboard" element={<PatientDashboard />} />
              </Route>

            </Route>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
   <Route path="/patient/dashboard" element={<PatientDashboard />} />
   {/* NEW ROUTE */}
   <Route path="/patient/book-appointment" element={<BookAppointment />} />
   <Route path="/my-appointments" element={<MyAppointments />} />
</Route>
        {/* 404 Route (Optional but recommended) */}
        <Route path="*" element={<div className="text-center mt-20">404 - Page Not Found</div>} />
      </Routes>
    </Suspense>
  );
}

export default App;