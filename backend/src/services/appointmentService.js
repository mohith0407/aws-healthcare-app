const dynamoDb = require('../utils/db');
const crypto = require('crypto'); // Built-in Node module
const TABLE_NAME = process.env.APPOINTMENTS_TABLE;

const ALL_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

const bookAppointment = async (data) => {
  const id = crypto.randomUUID();

  const item = {
    id: id,
    patientId: data.patientId,
    doctorId: data.doctorId,
    doctorName: data.doctorName,
    date: data.date,
    slot: data.slot,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  const params = {
    TableName: TABLE_NAME,
    Item: item,
  };

  await dynamoDb.put(params).promise();
  return { message: 'Appointment booked!', id: id };
};

const getAppointments = async (patientId) => {
  const params = {
    TableName: TABLE_NAME,
  };

  const result = await dynamoDb.scan(params).promise();
  let appointments = result.Items;

  // Filter by patientId if provided
  if (patientId) {
    appointments = appointments.filter(appt => appt.patientId === patientId);
  }
  
  return appointments;
};

const getAvailableSlots = async (doctorId, date) => {
  // A. Get all appointments from DB
  // (Optimization Note: In a real app with 1M+ rows, we would use a Query with Index, not Scan)
  const params = { TableName: TABLE_NAME };
  const result = await dynamoDb.scan(params).promise();
  const allAppointments = result.Items;

  // B. Find which slots are ALREADY booked for this specific doctor & date
  const bookedSlots = allAppointments
    .filter(appt => appt.doctorId === doctorId && appt.date === date)
    .map(appt => appt.slot); // e.g., ["10:00 AM"]

  // C. Filter out the booked slots
  const available = ALL_SLOTS.filter(slot => !bookedSlots.includes(slot));

  return available;
};

module.exports = { bookAppointment, getAppointments,getAvailableSlots };