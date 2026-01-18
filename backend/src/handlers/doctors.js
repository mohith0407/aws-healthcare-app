const doctorService = require('../services/doctorService');
const response = require('../utils/response');

module.exports.list = async (event) => {
  try {
    const doctors = await doctorService.getAllDoctors();
    return response.success(doctors);
  } catch (error) {
    console.error(error);
    return response.error(500, 'Could not fetch doctors');
  }
};

module.exports.create = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const newDoctor = await doctorService.createDoctor(data);
    return response.success(newDoctor);
  } catch (error) {
    console.error(error);
    return response.error(500, 'Could not create doctor');
  }
};