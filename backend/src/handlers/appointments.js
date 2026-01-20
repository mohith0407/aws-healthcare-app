const appointmentService = require('../services/appointmentService');
const response = require('../utils/response');

// 1. BOOK APPOINTMENT
module.exports.book = async (event) => {
  try {
    const data = JSON.parse(event.body);

    // Validation
    if (!data.patientId || !data.doctorId || !data.date || !data.slot) {
      return response.error(400, 'Missing required fields: patientId, doctorId, date, slot');
    }

    const result = await appointmentService.bookAppointment(data);
    return response.success(result);
  } catch (error) {
    console.error("Booking Error:", error);
    return response.error(500, 'Could not create appointment');
  }
};

// 2. LIST APPOINTMENTS
module.exports.list = async (event) => {
  try {
    // Helper to get query params safely
    const queryParams = event.queryStringParameters || {};
    console.log("HANDLER RECEIVED PARAMS:", queryParams);
    // 2. Pass the WHOLE object to the service
    const appointments = await appointmentService.getAppointments(queryParams);
    
    return response.success(appointments);
  } catch (error) {
    console.error("Fetch Error:", error);
    return response.error(500, 'Could not fetch appointments');
  }
};

// 3. GET SLOTS
module.exports.getSlots = async (event) => {
  try {
    const { doctorId, date } = event.queryStringParameters || {};

    if (!doctorId || !date) {
      return response.error(400, 'Missing parameters: doctorId and date');
    }

    const slots = await appointmentService.getAvailableSlots(doctorId, date);
    return response.success(slots);
  } catch (error) {
    console.error("Slot Error:", error);
    return response.error(500, 'Could not fetch slots');
  }
};

// 4. UPDATE STATUS (New Handler for Doctor Dashboard)
module.exports.update = async (event) => {
  try {
    const { id } = event.pathParameters;
    const { status } = JSON.parse(event.body);

    if (!id || !status) {
      return response.error(400, 'Missing appointment ID or status');
    }

    const result = await appointmentService.updateStatus(id, status);
    return response.success(result);
  } catch (error) {
    console.error("Update Error:", error);
    return response.error(500, 'Could not update appointment');
  }
};