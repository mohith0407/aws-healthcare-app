import React, { useState, useEffect } from 'react';
import Seo from '../../components/utils/Seo';
import { DOCTORS, getAvailableSlots } from '../../services/mockData';
import { FaUserMd, FaCalendarAlt, FaClock, FaCheckCircle } from 'react-icons/fa';

const BookAppointment = () => {
  // --- STATE ---
  const [step, setStep] = useState(1); // 1: Doctor, 2: Date/Time, 3: Confirm
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // --- HANDLERS ---
  
  // When a date is picked, fetch slots
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      setLoadingSlots(true);
      setAvailableSlots([]); // Clear previous
      getAvailableSlots(selectedDoctor.id, selectedDate).then((slots) => {
        setAvailableSlots(slots);
        setLoadingSlots(false);
      });
    }
  }, [selectedDate, selectedDoctor]);

  const handleBook = () => {
    // TODO: Send to backend
    const payload = {
      doctorId: selectedDoctor.id,
      date: selectedDate,
      slot: selectedSlot,
      patientId: 'currentUser.id' // From AuthContext
    };
    console.log('Booking Payload:', payload);
    alert('Appointment Booked Successfully!');
    // Redirect to Dashboard or Reset
    setStep(1);
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedSlot('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Seo title="Book Appointment" />
      
      <h1 className="text-2xl font-bold mb-6">New Appointment</h1>

      {/* Progress Bar */}
      <div className="flex items-center mb-8">
        <div className={`flex-1 h-2 rounded-l-full ${step >= 1 ? 'bg-primary' : 'bg-gray-200'}`}></div>
        <div className={`flex-1 h-2 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
        <div className={`flex-1 h-2 rounded-r-full ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
      </div>

      {/* --- STEP 1: SELECT DOCTOR --- */}
      {step === 1 && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaUserMd className="text-primary"/> Select a Doctor
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DOCTORS.map((doc) => (
              <div 
                key={doc.id}
                onClick={() => { setSelectedDoctor(doc); setStep(2); }}
                className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-lg hover:border-primary cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <img src={doc.image} alt={doc.name} className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <h3 className="font-bold text-gray-800 group-hover:text-primary">{doc.name}</h3>
                    <p className="text-sm text-gray-500">{doc.specialization}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm border-t pt-3 mt-2">
                   <span className="text-gray-500">{doc.experience} exp</span>
                   <span className="font-bold text-slate-700">{doc.fee}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- STEP 2: DATE & TIME --- */}
      {step === 2 && (
        <div className="animate-fade-in space-y-8">
           <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-primary mb-4">&larr; Back to Doctors</button>
           
           <div className="bg-white p-6 rounded-xl border border-gray-100 flex items-center gap-4">
             <img src={selectedDoctor.image} alt="" className="w-16 h-16 rounded-full object-cover" />
             <div>
               <p className="text-sm text-gray-500">Booking with</p>
               <h3 className="text-xl font-bold">{selectedDoctor.name}</h3>
               <p className="text-primary text-sm">{selectedDoctor.specialization}</p>
             </div>
           </div>

           <div className="grid md:grid-cols-2 gap-8">
             {/* Date Picker */}
             <div>
               <h3 className="font-semibold mb-3 flex items-center gap-2">
                 <FaCalendarAlt /> Select Date
               </h3>
               <input 
                 type="date" 
                 className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                 min={new Date().toISOString().split('T')[0]} // Disable past dates
                 value={selectedDate}
                 onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(''); }}
               />
             </div>

             {/* Slot Selector */}
             <div>
               <h3 className="font-semibold mb-3 flex items-center gap-2">
                 <FaClock /> Available Slots
               </h3>
               
               {!selectedDate && <p className="text-gray-400 text-sm">Please select a date first.</p>}
               
               {selectedDate && loadingSlots && (
                 <div className="text-primary text-sm animate-pulse">Checking availability...</div>
               )}

               {selectedDate && !loadingSlots && (
                 <div className="grid grid-cols-3 gap-3">
                   {availableSlots.map((slot) => (
                     <button
                       key={slot}
                       onClick={() => setSelectedSlot(slot)}
                       className={`py-2 px-3 text-sm rounded-lg border transition-all ${
                         selectedSlot === slot 
                           ? 'bg-primary text-white border-primary shadow-md' 
                           : 'bg-white text-gray-700 border-gray-200 hover:border-primary'
                       }`}
                     >
                       {slot}
                     </button>
                   ))}
                 </div>
               )}
             </div>
           </div>
           
           <div className="flex justify-end mt-6">
             <button 
               disabled={!selectedDate || !selectedSlot}
               onClick={() => setStep(3)}
               className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
             >
               Continue
             </button>
           </div>
        </div>
      )}

      {/* --- STEP 3: CONFIRM --- */}
      {step === 3 && (
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center animate-fade-in">
           <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
             <FaCheckCircle />
           </div>
           <h2 className="text-2xl font-bold mb-2">Confirm Booking</h2>
           <p className="text-gray-500 mb-6">Please review the details below.</p>

           <div className="bg-slate-50 p-4 rounded-lg text-left space-y-3 mb-6">
             <div className="flex justify-between">
               <span className="text-gray-500">Doctor</span>
               <span className="font-semibold">{selectedDoctor.name}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-gray-500">Date</span>
               <span className="font-semibold">{selectedDate}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-gray-500">Time</span>
               <span className="font-semibold">{selectedSlot}</span>
             </div>
             <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
               <span className="text-gray-500">Consultation Fee</span>
               <span className="font-semibold text-primary">{selectedDoctor.fee}</span>
             </div>
           </div>

           <div className="flex gap-4">
             <button onClick={() => setStep(2)} className="flex-1 btn-outline">Back</button>
             <button onClick={handleBook} className="flex-1 btn-primary">Confirm Booking</button>
           </div>
        </div>
      )}

    </div>
  );
};

export default BookAppointment;