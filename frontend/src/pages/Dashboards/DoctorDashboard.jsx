import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Seo from '../../components/utils/Seo';

const DoctorDashboard = () => {
  const { user } = useAuth();
  
  return (
    <div>
       <Seo title="Doctor Dashboard" />
       <div className="flex justify-between items-end mb-6">
         <div>
           <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
           <p className="text-gray-500">You have 4 appointments today.</p>
         </div>
         <button className="btn-primary">View Calendar</button>
       </div>

       {/* Appointment Queue */}
       <div className="space-y-4">
         {[1, 2, 3].map((i) => (
           <div key={i} className="bg-white p-4 rounded-lg border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow">
             <div className="flex gap-4 items-center">
               <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">P{i}</div>
               <div>
                 <h4 className="font-semibold">Patient Name {i}</h4>
                 <p className="text-sm text-gray-500">10:00 AM - General Checkup</p>
               </div>
             </div>
             <div className="flex gap-2">
                <button className="text-green-600 font-medium text-sm hover:underline">Accept</button>
                <button className="text-red-500 font-medium text-sm hover:underline">Reschedule</button>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
};
export default DoctorDashboard;