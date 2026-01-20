import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAppointments } from '../../redux/slices/appointmentSlice';
import { fetchDoctors } from '../../redux/slices/doctorSlice';
import Seo from '../../components/utils/Seo';
import { FaCalendarCheck, FaClock, FaUserMd, FaSearch, FaMapMarkerAlt, FaStethoscope } from 'react-icons/fa';

const PatientDashboard = () => {
  const dispatch = useDispatch();
  
  // 1. Get Data from Redux
  const { user } = useSelector((state) => state.auth);
  const { list: appointments, loading: apptLoading } = useSelector((state) => state.appointments);
  const { list: doctors, loading: docLoading } = useSelector((state) => state.doctors);

  // 2. Local State for Search
  const [searchTerm, setSearchTerm] = useState('');

  // 3. Fetch Data on Mount
  const userId = user?.id || user?.username || user?.sub;

  useEffect(() => {
    if (userId) {
      // Fetch User's Appointments
      dispatch(fetchAppointments({ role: 'patient', userId: userId }));
      // Fetch All Doctors (Optimized: Fetches once, filters locally)
      dispatch(fetchDoctors());
    }
  }, [dispatch, userId]);

  // 4. Optimized Search Logic
  // Filters by Name OR Specialization (Case insensitive)
  const filteredDoctors = doctors.filter((doc) => {
    if (!searchTerm) return false; // Hide list when not searching (Optional: remove this line to show all by default)
    const term = searchTerm.toLowerCase();
    return (
      doc.name.toLowerCase().includes(term) ||
      doc.specialization?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Seo title="My Health Dashboard" />
      
      {/* --- HERO SECTION WITH SEARCH --- */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl p-6 md:p-10 text-white mb-10 shadow-xl relative overflow-hidden">
         {/* Decorator Circles */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full -ml-10 -mb-10 blur-2xl pointer-events-none"></div>

         <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Hello, {user?.name || 'Patient'} 👋
            </h1>
            <p className="text-blue-50 text-lg mb-8 opacity-90">
              Find the right specialist for your health needs.
            </p>

            {/* Search Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search 'Cardiologist', 'Dentist', or 'Dr. Smith'..." 
                  className="w-full pl-11 pr-4 py-4 rounded-xl text-gray-900 bg-white shadow-lg outline-none border-2 border-transparent focus:border-blue-300 transition-all placeholder-gray-400"
              />
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN: SEARCH RESULTS & DOCTORS (Span 8) --- */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* A. Search Results Area */}
          {searchTerm && (
            <div className="animate-fade-in-up">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaSearch className="text-primary text-sm"/> Search Results
              </h2>
              
              {filteredDoctors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDoctors.map((doc) => (
                    <div key={doc.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl shrink-0">
                          {doc.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg leading-tight">{doc.name}</h3>
                          <p className="text-primary font-medium text-sm flex items-center gap-1 mt-1">
                            <FaStethoscope className="text-xs"/> {doc.specialization}
                          </p>
                        </div>
                      </div>
                      <Link 
                        to={`/patient/book-appointment?doctorId=${doc.id}`} 
                        className="w-full block text-center bg-gray-50 hover:bg-primary hover:text-white text-gray-700 font-medium py-2.5 rounded-xl transition-colors"
                      >
                        Book Appointment
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-2xl text-center border border-dashed text-gray-500">
                  <p>No doctors found matching "{searchTerm}"</p>
                </div>
              )}
            </div>
          )}

          {/* B. Upcoming Appointments List */}
          <div>
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Your Appointments</h2>
                <Link to="/patient/book-appointment" className="text-sm text-primary font-semibold hover:bg-blue-50 px-3 py-1 rounded-lg transition">
                  + Book New
                </Link>
             </div>

             {apptLoading ? (
                <div className="p-10 text-center text-gray-400">Loading appointments...</div>
             ) : appointments.length === 0 ? (
                <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center shadow-sm">
                  <div className="text-5xl mb-4">🗓️</div>
                  <h3 className="text-lg font-bold text-gray-800">No Appointments Yet</h3>
                  <p className="text-gray-500 mb-6">Book your first consultation today.</p>
                  <Link to="/patient/book-appointment" className="btn-primary inline-block">
                    Find a Doctor
                  </Link>
                </div>
             ) : (
                <div className="space-y-4">
                  {appointments.map((appt) => (
                    <div key={appt.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                      {/* Status Stripe */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 
                        ${appt.status === 'confirmed' ? 'bg-green-500' : 
                          appt.status === 'rescheduled' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                      </div>

                      <div className="flex gap-5 items-center w-full pl-2">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xl shrink-0">
                          <FaUserMd />
                        </div>
                        
                        <div>
                          <h4 className="font-bold text-gray-800 text-lg">
                            {appt.doctorName || 'Medical Officer'}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded text-xs font-medium">
                              <FaCalendarCheck className="text-blue-400"/> {appt.date}
                            </span>
                            <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded text-xs font-medium">
                               <FaClock className="text-blue-400"/> {appt.slot}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide 
                          ${appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                            appt.status === 'rescheduled' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                          {appt.status || 'upcoming'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
             )}
          </div>
        </div>

        {/* --- RIGHT COLUMN: QUICK INFO / PROMO (Span 4) --- */}
        <div className="lg:col-span-4 space-y-6">
           {/* Tip Card */}
           <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
             <div className="absolute -right-6 -top-6 bg-white/10 w-32 h-32 rounded-full blur-2xl"></div>
             <h3 className="text-lg font-bold mb-2 relative z-10">Need Help?</h3>
             <p className="text-blue-100 text-sm mb-4 relative z-10">
               Can't find the right doctor? Our support team can help you schedule via phone.
             </p>
             <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-50 transition relative z-10">
               Call Support
             </button>
           </div>

           {/* Quick Categories (Static for now, can be dynamic later) */}
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
             <h3 className="font-bold text-gray-800 mb-4">Popular Specialties</h3>
             <div className="flex flex-wrap gap-2">
               {['Cardiologist', 'Dermatologist', 'Neurologist', 'General', 'Pediatrics'].map(tag => (
                 <button 
                   key={tag}
                   onClick={() => setSearchTerm(tag)} 
                   className="text-xs font-medium bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors"
                 >
                   {tag}
                 </button>
               ))}
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;