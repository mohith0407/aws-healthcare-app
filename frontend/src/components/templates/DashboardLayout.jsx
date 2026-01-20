import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import { FaUserMd, FaUsers, FaCalendarAlt, FaSignOutAlt, FaHome } from 'react-icons/fa';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Select only necessary auth state
  const { user, loading } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      // Dispatch the thunk and wait for it to clear Amplify/Redux
      await dispatch(logoutUser()).unwrap();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Memoize or define links based on user role
  const getLinks = () => {
    const role = user?.role?.toLowerCase(); // Ensure case-insensitive matching
    switch (role) {
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

  // Helper for active link styling
  const navLinkClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`;

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <span className="text-2xl font-bold text-blue-600 tracking-tight">DocAppoint</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {getLinks().map((link) => (
            <NavLink 
              key={link.path} 
              to={link.path}
              className={navLinkClass}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 px-2 py-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-blue-600 font-medium capitalize">{user?.role || 'Guest'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition-all text-sm font-semibold disabled:opacity-50"
          >
            <FaSignOutAlt /> {loading ? 'Signing Out...' : 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:hidden flex-shrink-0">
           <span className="font-bold text-blue-600 text-lg">DocAppoint</span>
           <button 
             onClick={handleLogout} 
             className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
             aria-label="Sign Out"
           >
             <FaSignOutAlt size={20} />
           </button>
        </header>
        
        {/* Content Container */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
