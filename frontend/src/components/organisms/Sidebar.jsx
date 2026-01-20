import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import { cn } from '../utils/cn';
import { FaHome, FaUserMd, FaCalendarAlt, FaSignOutAlt, FaCog } from 'react-icons/fa';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const role = user?.role || 'patient';

  // Define menus based on role
  const menus = {
    patient: [
      { name: 'Dashboard', path: '/patient/dashboard', icon: FaHome },
      { name: 'My Appointments', path: '/patient/my-appointments', icon: FaCalendarAlt },
      { name: 'Book New', path: '/patient/book-appointment', icon: FaUserMd },
    ],
    doctor: [
      { name: 'Dashboard', path: '/doctor/dashboard', icon: FaHome },
      { name: 'Schedule', path: '/doctor/schedule', icon: FaCalendarAlt },
    ],
    admin: [
      { name: 'Overview', path: '/admin/dashboard', icon: FaHome },
    ]
  };

  const currentMenu = menus[role] || menus['patient'];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 flex flex-col z-40 hidden md:flex">
      {/* Brand */}
      <div className="h-20 flex items-center px-8 border-b border-slate-100">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
          HealthApp.
        </div>
      </div>

      {/* Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {currentMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-primary-50 text-primary-700 shadow-sm" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon className="text-lg" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{role}</p>
          </div>
        </div>
        <button 
          onClick={() => dispatch(logoutUser())}
          className="w-full flex items-center justify-center gap-2 text-sm text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
        >
          <FaSignOutAlt /> Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;