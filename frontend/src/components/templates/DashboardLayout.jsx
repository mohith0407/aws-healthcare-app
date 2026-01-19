import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { FaUserMd, FaUsers, FaCalendarAlt, FaSignOutAlt, FaHome } from 'react-icons/fa'; // Ensure react-icons is installed

const DashboardLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // 1. Get User Data for UI
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Define sidebar links based on role
  const getLinks = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { label: 'Overview', path: '/admin/dashboard', icon: <FaHome /> },
          { label: 'All Doctors', path: '/admin/doctors', icon: <FaUserMd /> },
          { label: 'All Patients', path: '/admin/patients', icon: <FaUsers /> },
        ];
      case 'doctor':
        return [
          { label: 'My Appointments', path: '/doctor/dashboard', icon: <FaCalendarAlt /> },
          { label: 'Patient Records', path: '/doctor/patients', icon: <FaUsers /> },
          { label: 'Profile', path: '/doctor/profile', icon: <FaUserMd /> },
        ];
      case 'patient':
        return [
        { label: 'Overview', path: '/patient/dashboard', icon: <FaHome /> },
          { label: 'Book Appointment', path: '/patient/book-appointment', icon: <FaCalendarAlt /> },
          { label: 'Find Doctors', path: '/doctors', icon: <FaUserMd /> },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <span className="text-xl font-bold text-primary">DocAppoint</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {getLinks().map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-primary rounded-lg transition-colors"
            >
              {link.icon}
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 md:hidden">
           {/* Mobile Header (simplified) */}
           <span className="font-bold text-primary">DocAppoint</span>
           <button onClick={handleLogout} className="text-red-500"><FaSignOutAlt /></button>
        </header>
        
        <div className="p-8">
          <Outlet /> {/* This is where the specific dashboard content loads */}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;