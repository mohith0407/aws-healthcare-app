const appointmentService = require('../services/appointmentService');
const response = require('../utils/response');

module.exports.book = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const result = await appointmentService.bookAppointment(data);
    return response.success(result);
  } catch (error) {
    console.error("Booking Error:", error);
    return response.error(500, 'Could not create appointment');
  }
};

module.exports.list = async (event) => {
  try {
    // Get patientId from Query Parameters (e.g., ?patientId=123)
    const patientId = event.queryStringParameters && event.queryStringParameters.patientId;
    
    const appointments = await appointmentService.getAppointments(patientId);
    return response.success(appointments);
  } catch (error) {
    console.error("Fetch Error:", error);
    return response.error(500, 'Could not fetch appointments');
  }
};

module.exports.getSlots = async (event) => {
  try {
    // 1. Read parameters from the URL (e.g., ?doctorId=1&date=2023-10-25)
    const { doctorId, date } = event.queryStringParameters || {};

    // 2. Validate input
    if (!doctorId || !date) {
      return response.error(400, 'Missing required parameters: doctorId and date');
    }

    // 3. Call the service
    const slots = await appointmentService.getAvailableSlots(doctorId, date);
    return response.success(slots);

  } catch (error) {
    console.error("Slot Error:", error);
    return response.error(500, 'Could not fetch slots');
  }
};