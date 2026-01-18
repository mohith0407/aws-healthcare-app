const dynamoDb = require('../utils/db');
const TABLE_NAME = process.env.DOCTORS_TABLE || 'healthcare-api-dev-doctors';

const getAllDoctors = async () => {
  const params = { TableName: TABLE_NAME };
  const result = await dynamoDb.scan(params).promise();
  return result.Items;
};

const createDoctor = async (doctorData) => {
  const params = {
    TableName: TABLE_NAME,
    Item: doctorData,
  };
  await dynamoDb.put(params).promise();
  return doctorData;
};

module.exports = { getAllDoctors, createDoctor };