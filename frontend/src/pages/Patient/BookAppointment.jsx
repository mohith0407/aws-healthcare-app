import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Redux Hooks
import { fetchDoctors } from '../../redux/slices/doctorSlice'; // Use the Slice, not api.js
import { bookAppointment, fetchAvailableSlots } from '../../services/api'; // Keep these service calls
import Seo from '../../components/utils/Seo';
import { FaUserMd, FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa';

const BookAppointment = () => {
  const dispatch = useDispatch();
  
  // 1. Get Real Data from Redux
  const { list: doctors, loading: loadingDoctors } = useSelector((state) => state.doctors);
  const { user } = useSelector((state) => state.auth);

  // --- STATE ---
  const [step, setStep] = useState(1); 
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  // --- HANDLERS ---

  // 2. Fetch Real Doctors on Mount
  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  // Load Slots when Date/Doctor changes
  useEffect(() => {
    const loadSlots = async () => {
      if (selectedDoctor && selectedDate) {
        setLoadingSlots(true);
        const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
        try {
          // Ensure fetchAvailableSlots hits your backend, not mock data
          const slots = await fetchAvailableSlots(selectedDoctor.id, formattedDate);
          setAvailableSlots(slots || []); 
        } catch (e) {
          console.error(e);
          setAvailableSlots([]);
        }
        setLoadingSlots(false);
      } else {
        setAvailableSlots([]); 
      }
    };
    loadSlots();
  }, [selectedDate, selectedDoctor]);

  const handleBook = async () => {
    if (!user) return alert("Please log in first.");
    
    const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
    
    try {
      const payload = {
        patientId: user.id, // <--- 3. FIX: Use Real User ID from Redux
        patientName: user.name, // Pass name for easier display later
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name, // Pass name to save DB lookups
        date: formattedDate, 
        slot: selectedSlot,
        status: 'upcoming'
      };
      
      await bookAppointment(payload); 
      
      alert('Appointment Booked Successfully!');
      setStep(1);
      setSelectedDoctor(null);
      setSelectedDate('');
      setSelectedSlot('');
    } catch (err) {
      alert("Booking failed! Check console.");
      console.error("Booking Error:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Seo title="Book Appointment" />
      <h1 className="text-2xl font-bold mb-6">New Appointment</h1>

      {/* Progress Bar (Same as before) */}
      <div className="flex items-center mb-8">
        <div className={`flex-1 h-2 rounded-l-full ${step >= 1 ? 'bg-primary' : 'bg-gray-200'}`}></div>
        <div className={`flex-1 h-2 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
        <div className={`flex-1 h-2 rounded-r-full ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
      </div>

      {/* --- STEP 1: SELECT DOCTOR (REAL DATA) --- */}
      {step === 1 && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaUserMd className="text-primary" /> Select a Doctor
          </h2>
          
          {loadingDoctors ? (
             <div className="p-8 text-center text-gray-500">Loading Doctors...</div>
          ) : doctors.length === 0 ? (
             <div className="p-8 text-center text-red-500">No doctors found.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => { setSelectedDoctor(doc); setStep(2); }}
                  className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-lg hover:border-primary cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    {/* Placeholder image if none exists */}
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                      {doc.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 group-hover:text-primary">{doc.name}</h3>
                      <p className="text-sm text-gray-500">{doc.specialization}</p>
                    </div>
                  </div>
                  {/* Fee and Exp (Handle if missing in DB) */}
                  <div className="flex justify-between items-center text-sm border-t pt-3 mt-2">
                    <span className="text-gray-500">Available</span>
                    <span className="font-bold text-slate-700">$50</span> 
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

            {/* --- STEP 2: DATE & TIME SELECTION --- */}
      {step === 2 && (
        <div className="animate-fade-in space-y-6">
          <button 
            onClick={() => { setStep(1); setSelectedSlot(''); }} 
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors"
          >
            &larr; Change Doctor ({selectedDoctor?.name})
          </button>

          <div className="grid md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            {/* Left: Date Picker */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaCalendarAlt className="text-primary" /> Select Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]} // Prevents past dates
                value={selectedDate}
                onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(''); }}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>

            {/* Right: Slot Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaClock className="text-primary" /> Available Slots
              </label>
              
              {!selectedDate ? (
                <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl text-gray-400 text-sm text-center px-4">
                  Please select a date to view available timings.
                </div>
              ) : loadingSlots ? (
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map(n => (
                    <div key={n} className="h-10 bg-gray-50 animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                        selectedSlot === slot
                          ? 'bg-primary text-white border-primary shadow-md'
                          : 'bg-white text-gray-600 border-gray-100 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                  No slots available for this date. Try another day.
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              disabled={!selectedDate || !selectedSlot}
              onClick={() => setStep(3)}
              className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              Review Booking
            </button>
          </div>
        </div>
      )}


      {step === 3 && (
         // ... (Keep your existing Confirmation UI)
         <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center animate-fade-in">
             <h2 className="text-2xl font-bold mb-2">Confirm Booking</h2>
             {/* ... details ... */}
             <div className="flex gap-4 mt-6">
               <button onClick={() => setStep(2)} className="flex-1 btn-outline">Back</button>
               <button onClick={handleBook} className="flex-1 btn-primary">Confirm Booking</button>
             </div>
         </div>
      )}

    </div>
  );
};

export default BookAppointment;