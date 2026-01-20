const dynamoDb = require('../utils/db');
const crypto = require('crypto'); // Built-in Node module
const TABLE_NAME = process.env.APPOINTMENTS_TABLE  || 'healthcare-api-dev-appointments';

const ALL_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

// 1. BOOK APPOINTMENT
const bookAppointment = async (data) => {
  const id = crypto.randomUUID();

  const item = {
    id: id,
    patientId: data.patientId,
    patientName: data.patientName || 'Unknown Patient',
    doctorId: data.doctorId,
    doctorName: data.doctorName || 'Unknown Doctor',
    date: data.date,
    slot: data.slot,
    status: 'upcoming',
    createdAt: new Date().toISOString(),
  };

  const params = {
    TableName: TABLE_NAME,
    Item: item,
  };

  await dynamoDb.put(params).promise();
  return item;
};

// 2. FETCH APPOINTMENTS (The Fixed Function)
const getAppointments = async (params) => {
  console.log("🔍 SERVICE RECEIVED:", JSON.stringify(params)); // Debugging

  const dbParams = {
    TableName: TABLE_NAME,
  };

  const result = await dynamoDb.scan(dbParams).promise();
  let appointments = result.Items;

  // Scenario A: Doctor is logged in -> Show ONLY their appointments
  if (params.role === 'doctor' && params.userId) {
    return appointments.filter(appt => appt.doctorId === params.userId);
  }

  // Scenario B: Patient is logged in -> Show ONLY their appointments
  if (params.role === 'patient' && params.userId) {
    return appointments.filter(appt => appt.patientId === params.userId);
  }

  // Scenario C: Legacy/Fallback (if just patientId string was passed)
  if (params.patientId && typeof params.patientId === 'string') {
    return appointments.filter(appt => appt.patientId === params.patientId);
  }

  // Default: Return nothing for security if we don't know who is asking
  console.log("⚠️ No matching role/ID found. Returning empty list.");
  return [];
};

// 3. GET AVAILABLE SLOTS
const getAvailableSlots = async (doctorId, date) => {
  const params = { TableName: TABLE_NAME };
  const result = await dynamoDb.scan(params).promise();
  const allAppointments = result.Items;

  const bookedSlots = allAppointments
    .filter(appt => appt.doctorId === doctorId && appt.date === date)
    .map(appt => appt.slot);

  const available = ALL_SLOTS.filter(slot => !bookedSlots.includes(slot));
  return available;
};

// 4. UPDATE STATUS
const updateStatus = async (id, status, rescheduleData = null) => {
  let updateExpression = 'set #status = :status';
  let expressionAttributeNames = { '#status': 'status' };
  let expressionAttributeValues = { ':status': status };

  // If rescheduling, update date and slot too
  if (status === 'rescheduled' && rescheduleData) {
    updateExpression += ', #date = :date, #slot = :slot';
    expressionAttributeNames['#date'] = 'date';
    expressionAttributeNames['#slot'] = 'slot';
    expressionAttributeValues[':date'] = rescheduleData.date;
    expressionAttributeValues[':slot'] = rescheduleData.slot;
  }

  const params = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  };

  const result = await dynamoDb.update(params).promise();
  return result.Attributes;
};

module.exports = { 
  bookAppointment, 
  getAppointments, 
  getAvailableSlots,
  updateStatus 
};

module.exports = { 
  bookAppointment, 
  getAppointments, 
  getAvailableSlots,
  updateStatus 
};