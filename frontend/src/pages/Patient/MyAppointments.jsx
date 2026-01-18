import React, { useEffect, useState } from 'react';
import { fetchAppointments } from '../../services/api';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const patientId = "test-user-01"; // Hardcoded for now

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAppointments(patientId);
        // Sort by date (newest first)
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAppointments(sorted);
      } catch (error) {
        alert("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading your history...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Appointments</h2>

      {appointments.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center border border-gray-200">
          <p className="text-gray-500">You have no upcoming appointments.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appt) => (
            <div key={appt.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-blue-600">{appt.doctorName}</h3>
                  <p className="text-gray-500 text-sm mt-1">Appointment ID: {appt.id.slice(0, 8)}...</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full uppercase font-bold">
                  {appt.status}
                </span>
              </div>
              
              <div className="mt-4 flex gap-6 text-gray-700">
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span>{appt.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⏰</span>
                  <span>{appt.slot}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;