import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAppointments } from '../../redux/slices/appointmentSlice'; 
import Seo from '../../components/utils/Seo';
import { FaCalendarCheck, FaClock, FaUser } from 'react-icons/fa';

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  
  // 1. Get User and Appointments from Redux
  const { user } = useSelector((state) => state.auth);
  const { list: appointments, loading, error } = useSelector((state) => state.appointments);

  // 2. Fetch Data when component mounts
  useEffect(() => {
    if (user?.id) {
      // Pass role and ID so the backend knows whose data to send
      dispatch(fetchAppointments({ role: 'doctor', userId: user.id }));
    }
  }, [dispatch, user]);

  return (
    <div>
       <Seo title="Doctor Dashboard" />
       
       <div className="flex justify-between items-end mb-6">
         <div>
           <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
           <p className="text-gray-500">
             You have <span className="font-bold text-primary">{appointments.length}</span> appointments.
           </p>
         </div>
         <button className="btn-primary">View Calendar</button>
       </div>

       {/* 3. Error State */}
       {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-4">{error}</div>}

       {/* 4. Loading State */}
       {loading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse">Loading appointments...</div>
       ) : (
          <div className="space-y-4">
            {/* 5. Empty State */}
            {appointments.length === 0 && (
              <div className="text-center py-10 bg-white rounded-lg border border-dashed">
                <p className="text-gray-500">No appointments found.</p>
              </div>
            )}

            {/* 6. Real Data Map */}
            {appointments.map((appt) => (
              <div key={appt.id} className="bg-white p-5 rounded-lg border border-gray-100 flex flex-col md:flex-row justify-between items-center hover:shadow-md transition-shadow gap-4">
                
                <div className="flex gap-4 items-center w-full">
                  {/* Avatar with Patient Initial */}
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0">
                    {appt.patientName ? appt.patientName.charAt(0).toUpperCase() : <FaUser />}
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">
                      {appt.patientName || 'Unknown Patient'}
                    </h4>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <FaCalendarCheck className="text-gray-400"/> {appt.date}
                      </span>
                      <span className="flex items-center gap-1">
                         <FaClock className="text-gray-400"/> {appt.slot}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full md:w-auto">
                   <button className="flex-1 md:flex-none px-4 py-2 bg-green-50 text-green-700 font-medium rounded hover:bg-green-100 text-sm transition">
                     Accept
                   </button>
                   <button className="flex-1 md:flex-none px-4 py-2 bg-red-50 text-red-600 font-medium rounded hover:bg-red-100 text-sm transition">
                     Reschedule
                   </button>
                </div>
              </div>
            ))}
          </div>
       )}
    </div>
  );
};

export default DoctorDashboard;