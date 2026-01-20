import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAppointments, updateAppointmentStatus } from '../../redux/slices/appointmentSlice'; 
import Seo from '../../components/utils/Seo';
import { FaCalendarCheck, FaClock, FaUser, FaCheck } from 'react-icons/fa';

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  
  // 1. Get User and Appointments from Redux
  const { user } = useSelector((state) => state.auth);
  const { list: appointments, loading, error } = useSelector((state) => state.appointments);

  // 2. Fetch Data when component mounts
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAppointments({ role: 'doctor', userId: user.id }));
    }
  }, [dispatch, user]);

  const handleStatusUpdate = (id, newStatus) => {
    // Only ask for confirmation, dispatch is handled in Redux
    if (window.confirm(`Are you sure you want to ${newStatus} this appointment?`)) {
      dispatch(updateAppointmentStatus({ id, status: newStatus }));
    }
  };

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

            {/* 6. Real Data Map (Updated with Status Logic) */}
            {appointments.map((appt) => (
              <div key={appt.id} className="bg-white p-5 rounded-lg border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow">
                
                {/* Patient Info */}
                <div className="flex gap-4 items-center w-full">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0">
                    {appt.patientName ? appt.patientName.charAt(0).toUpperCase() : <FaUser />}
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">
                      {appt.patientName || 'Unknown Patient'}
                    </h4>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <FaCalendarCheck className="text-gray-400"/> {appt.date}
                      </span>
                      <span className="flex items-center gap-1">
                         <FaClock className="text-gray-400"/> {appt.slot}
                      </span>
                      {/* Badge for Status */}
                      <span className={`px-2 py-0.5 rounded text-xs font-bold capitalize 
                        ${appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                          appt.status === 'rescheduled' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                        {appt.status || 'upcoming'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons (Only show if 'upcoming') */}
                {(!appt.status || appt.status === 'upcoming') && (
                   <div className="flex gap-3 w-full md:w-auto">
                      <button 
                        onClick={() => handleStatusUpdate(appt.id, 'confirmed')}
                        className="flex-1 md:flex-none px-4 py-2 bg-green-50 text-green-700 font-medium rounded hover:bg-green-100 text-sm transition flex items-center justify-center gap-2"
                      >
                        <FaCheck /> Accept
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(appt.id, 'rescheduled')}
                        className="flex-1 md:flex-none px-4 py-2 bg-orange-50 text-orange-600 font-medium rounded hover:bg-orange-100 text-sm transition flex items-center justify-center gap-2"
                      >
                        <FaClock /> Reschedule
                      </button>
                   </div>
                )}
                
                {/* Show text if already acted upon */}
                {appt.status && appt.status !== 'upcoming' && (
                  <div className="text-gray-400 text-sm font-medium italic px-4 whitespace-nowrap">
                    {appt.status === 'confirmed' ? 'Accepted' : 'Rescheduled'}
                  </div>
                )}
              </div>
            ))}
          </div>
       )}
    </div>
  );
};

export default DoctorDashboard;