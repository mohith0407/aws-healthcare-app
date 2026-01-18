import React from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link
import Seo from '../../components/utils/Seo';

const PatientDashboard = () => {
  return (
    <div>
      <Seo title="My Health" />
      
      {/* Search Header */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
         <h1 className="text-3xl font-bold mb-2">Find your specialist</h1>
         <p className="text-blue-100 mb-6">Search for doctors, clinics, and more.</p>
         <input 
            type="text" 
            placeholder="Search e.g. Cardiologist..." 
            className="w-full max-w-lg px-4 py-3 rounded-lg text-gray-900 outline-none focus:ring-4 ring-white/30 placeholder-gray-400"
         />
      </div>
      
      <h2 className="text-xl font-bold mb-4 text-gray-800">Upcoming Appointments</h2>
      
      {/* Updated Empty State Section */}
      <div className="bg-white p-8 rounded-xl border border-dashed border-gray-300 text-center text-gray-500 py-16">
        <div className="mb-4 text-4xl">📅</div>
        <p className="text-lg">No upcoming appointments.</p>
        
        {/* 2. Updated Link */}
        <Link 
          to="/patient/book-appointment" 
          className="inline-block mt-4 text-primary font-semibold hover:text-sky-700 hover:underline transition-all"
        >
          Book a new appointment &rarr;
        </Link>
      </div>
    </div>
  );
};

export default PatientDashboard;