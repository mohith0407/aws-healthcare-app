'use strict';
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid'); // Used to generate unique IDs

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.APPOINTMENTS_TABLE || 'healthcare-api-dev-appointments';

module.exports.book = async (event) => {
  const data = JSON.parse(event.body);

  // Basic Validation
  if (!data.doctorId || !data.date || !data.patientId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields' }),
    };
  }

  const params = {
    TableName: TABLE_NAME,
    Item: {
      id: uuidv4(), // Generate a unique ID for the appointment
      patientId: data.patientId,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      date: data.date,
      slot: data.slot,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    },
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'Appointment booked!', id: params.Item.id }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not create appointment' }),
    };
  }
};