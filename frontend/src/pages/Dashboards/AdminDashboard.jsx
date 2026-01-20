import React from 'react';
import { useSelector } from 'react-redux'; // <--- UPDATED
import Seo from '../../components/utils/Seo';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <Seo title="Admin Dashboard" />
      
      <h1 className="text-2xl font-bold mb-6">
        Admin Portal <span className="text-gray-400 font-normal">| {user?.name || 'Super Admin'}</span>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Total Doctors: 12', 'Total Patients: 54', 'Appointments Today: 8'].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-semibold text-gray-700">{stat.split(':')[0]}</h3>
             <p className="text-3xl font-bold text-primary mt-2">{stat.split(':')[1]}</p>
          </div>
        ))}
      </div>
      
      {/* Placeholder for future features */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold mb-4">Pending Approvals</h2>
        <div className="h-32 bg-gray-50 rounded flex items-center justify-center text-gray-400 border-2 border-dashed">
          New doctor registrations will appear here.
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;