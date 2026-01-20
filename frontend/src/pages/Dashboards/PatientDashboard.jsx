import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAppointments } from '../../redux/slices/appointmentSlice';
import Seo from '../../components/utils/Seo';
import { FaCalendarCheck, FaClock, FaUserMd } from 'react-icons/fa';

const PatientDashboard = () => {
  const dispatch = useDispatch();
  
  // 1. Get Data from Redux
  const { user } = useSelector((state) => state.auth);
  const { list: appointments, loading, error } = useSelector((state) => state.appointments);

  // 2. Fetch Appointments on Mount
  useEffect(() => {
    if (user?.id) {
      // Fetch as a patient using the logged-in user's ID
      dispatch(fetchAppointments({ role: 'patient', userId: user.id }));
    }
  }, [dispatch, user]);

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
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Upcoming Appointments</h2>
        <Link to="/patient/book-appointment" className="text-sm text-primary font-semibold hover:underline">
          + Book New
        </Link>
      </div>

      {/* 3. Error State */}
      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-4 border border-red-100">{error}</div>}

      {/* 4. Loading State */}
      {loading ? (
         <div className="p-10 text-center text-gray-400 animate-pulse">Loading your schedule...</div>
      ) : (
         <div className="space-y-4">
           {/* 5. Empty State */}
           {appointments.length === 0 && (
             <div className="bg-white p-8 rounded-xl border border-dashed border-gray-300 text-center text-gray-500 py-16">
               <div className="mb-4 text-4xl">📅</div>
               <p className="text-lg">No upcoming appointments.</p>
               <Link 
                 to="/patient/book-appointment" 
                 className="inline-block mt-4 text-primary font-semibold hover:text-sky-700 hover:underline transition-all"
               >
                 Book a new appointment &rarr;
               </Link>
             </div>
           )}

           {/* 6. Real Appointment List */}
           {appointments.map((appt) => (
             <div key={appt.id} className="bg-white p-5 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow">
               
               <div className="flex gap-4 items-center w-full">
                 {/* Doctor Icon/Avatar */}
                 <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 font-bold text-xl shrink-0">
                   <FaUserMd />
                 </div>
                 
                 <div>
                   <h4 className="font-bold text-gray-800 text-lg">
                     {appt.doctorName || 'Unknown Doctor'}
                   </h4>
                   
                   <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                     <span className="flex items-center gap-1">
                       <FaCalendarCheck className="text-gray-400"/> {appt.date}
                     </span>
                     <span className="flex items-center gap-1">
                        <FaClock className="text-gray-400"/> {appt.slot}
                     </span>
                     
                     {/* Status Badge */}
                     <span className={`px-2 py-0.5 rounded text-xs font-bold capitalize 
                       ${appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                         appt.status === 'rescheduled' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                       {appt.status || 'upcoming'}
                     </span>
                   </div>
                 </div>
               </div>

               {/* Action Button (Optional) */}
               <div className="w-full sm:w-auto">
                  <button className="w-full px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded hover:bg-gray-50 transition">
                    View Details
                  </button>
               </div>
             </div>
           ))}
         </div>
      )}
    </div>
  );
};

export default PatientDashboard;