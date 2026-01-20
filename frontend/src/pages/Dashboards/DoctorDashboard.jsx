import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAppointments, updateAppointmentStatus, fetchSlots } from '../../redux/slices/appointmentSlice'; 
import Seo from '../../components/utils/Seo';
import { FaCalendarCheck, FaClock, FaUser, FaCheck, FaExchangeAlt, FaArrowLeft } from 'react-icons/fa';

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { list: appointments, slots, loading, error } = useSelector((state) => state.appointments);

  // Local State
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  
  // Reschedule Modal State
  const [rescheduleData, setRescheduleData] = useState(null); // { id, patientName }
  const [newDate, setNewDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  // 1. Fetch User Data
  const userId = user?.id || user?.username || user?.sub;
  useEffect(() => {
    if (userId) {
      dispatch(fetchAppointments({ role: 'doctor', userId: userId }));
    }
  }, [dispatch, userId]);

  // 2. Fetch Slots when Date is picked in Modal
  useEffect(() => {
    if (newDate && userId) {
      dispatch(fetchSlots({ doctorId: userId, date: newDate }));
    }
  }, [newDate, userId, dispatch]);

  // --- Handlers ---

  const handleAccept = (id) => {
    if (window.confirm("Confirm this appointment?")) {
      dispatch(updateAppointmentStatus({ id, status: 'confirmed' }));
    }
  };

  const openRescheduleModal = (appt) => {
    setRescheduleData(appt);
    setNewDate('');
    setSelectedSlot('');
  };

  const confirmReschedule = () => {
    if (!newDate || !selectedSlot) return alert("Please select a date and slot");
    
    dispatch(updateAppointmentStatus({
      id: rescheduleData.id,
      status: 'rescheduled',
      date: newDate, // Should handle this in slice/backend
      slot: selectedSlot
    })).then(() => {
      setRescheduleData(null); // Close modal
      alert("Appointment Rescheduled!");
    });
  };

  // --- Render Helpers ---

  // Sort appointments for Calendar View
  const sortedAppointments = [...appointments].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="relative">
       <Seo title="Doctor Dashboard" />
       
       {/* HEADER */}
       <div className="flex justify-between items-end mb-6">
         <div>
           <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
           <p className="text-gray-500">
             You have <span className="font-bold text-primary">{appointments.length}</span> appointments.
           </p>
         </div>
         {/* 3. VIEW CALENDAR TOGGLE */}
         <button 
            onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
            className="btn-primary flex items-center gap-2"
         >
            {viewMode === 'list' ? <><FaCalendarCheck /> View Calendar</> : <><FaArrowLeft /> Back to List</>}
         </button>
       </div>

       {/* ERROR */}
       {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-4">{error}</div>}

       {/* MAIN CONTENT AREA */}
       {loading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse">Loading...</div>
       ) : (
          <div className="space-y-4">
            
            {/* VIEW MODE: CALENDAR (Grouped by Date) */}
            {viewMode === 'calendar' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {sortedAppointments.map(appt => (
                        <div key={appt.id} className="bg-white p-4 border border-blue-100 rounded-lg shadow-sm">
                            <div className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded w-fit mb-2">
                                {appt.date}
                            </div>
                            <h4 className="font-bold">{appt.patientName}</h4>
                            <p className="text-sm text-gray-500">{appt.slot}</p>
                            <span className={`text-xs px-2 py-0.5 rounded font-bold mt-2 inline-block ${
                                appt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {appt.status}
                            </span>
                        </div>
                    ))}
                    {sortedAppointments.length === 0 && <p>No appointments to show.</p>}
                </div>
            )}

            {/* VIEW MODE: LIST (Standard) */}
            {viewMode === 'list' && appointments.map((appt) => (
              <div key={appt.id} className="bg-white p-5 rounded-lg border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm hover:shadow-md transition">
                
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
                      <span className="flex items-center gap-1"><FaCalendarCheck className="text-gray-400"/> {appt.date}</span>
                      <span className="flex items-center gap-1"><FaClock className="text-gray-400"/> {appt.slot}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold capitalize 
                        ${appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                          appt.status === 'rescheduled' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                        {appt.status || 'upcoming'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                {(!appt.status || appt.status === 'upcoming') && (
                   <div className="flex gap-3 w-full md:w-auto">
                      <button onClick={() => handleAccept(appt.id)} className="flex-1 md:flex-none px-4 py-2 bg-green-50 text-green-700 font-medium rounded hover:bg-green-100 text-sm flex items-center justify-center gap-2">
                        <FaCheck /> Accept
                      </button>
                      <button onClick={() => openRescheduleModal(appt)} className="flex-1 md:flex-none px-4 py-2 bg-orange-50 text-orange-600 font-medium rounded hover:bg-orange-100 text-sm flex items-center justify-center gap-2">
                        <FaExchangeAlt /> Reschedule
                      </button>
                   </div>
                )}
              </div>
            ))}
          </div>
       )}

       {/* 4. RESCHEDULE MODAL */}
       {rescheduleData && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
               <h3 className="text-xl font-bold mb-4">Reschedule Appointment</h3>
               <p className="text-gray-600 mb-4">Select a new time for <span className="font-bold">{rescheduleData.patientName}</span>.</p>
               
               {/* Date Picker */}
               <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
               <input 
                 type="date" 
                 min={new Date().toISOString().split('T')[0]}
                 value={newDate}
                 onChange={(e) => setNewDate(e.target.value)}
                 className="w-full border p-2 rounded mb-4"
               />

               {/* Slots */}
               {newDate && (
                 <>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Available Slots</label>
                   <div className="grid grid-cols-3 gap-2 mb-6">
                      {slots.length > 0 ? slots.map(slot => (
                        <button 
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 text-sm rounded border ${selectedSlot === slot ? 'bg-primary text-white border-primary' : 'hover:bg-gray-50'}`}
                        >
                          {slot}
                        </button>
                      )) : <p className="text-sm text-red-500 col-span-3">No slots available</p>}
                   </div>
                 </>
               )}

               <div className="flex gap-3 justify-end">
                 <button onClick={() => setRescheduleData(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                 <button onClick={confirmReschedule} disabled={!selectedSlot} className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50">Confirm Reschedule</button>
               </div>
            </div>
         </div>
       )}
    </div>
  );
};

export default DoctorDashboard;