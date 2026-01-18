// src/App.jsx
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/utils/ProtectedRoute';
import DashboardLayout from './components/templates/DashboardLayout';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));

const BookAppointment = lazy(() => import('./pages/patient/BookAppointment'));
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
</Route>
        {/* 404 Route (Optional but recommended) */}
        <Route path="*" element={<div className="text-center mt-20">404 - Page Not Found</div>} />
      </Routes>
    </Suspense>
  );
}

export default App;