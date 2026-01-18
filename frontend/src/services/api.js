import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// 1. Fetch Doctors from AWS
export const fetchDoctors = async () => {
  try {
    const response = await axios.get(`${API_URL}/doctors`);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
};

// 2. Book Appointment on AWS
export const bookAppointment = async (appointmentData) => {
  try {
    const response = await axios.post(`${API_URL}/appointments`, appointmentData);
    return response.data;
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw error;
  }
};

// 3. Mock Slots (Since we haven't built complex slot logic yet)
export const getAvailableSlots = () => {
  return Promise.resolve([
    '09:00 AM', '10:00 AM', '02:00 PM', '04:00 PM'
  ]);
};