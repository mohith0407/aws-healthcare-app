'use strict';
const AWS = require('aws-sdk');
const crypto = require('crypto');

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
      id: crypto.randomUUID(), // Generate a unique ID for the appointment
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

module.exports.list = async (event) => {
  // In a real app, we would get the patientId from the logged-in user's token.
  // For now, we look for it in the query string: ?patientId=test-user-01
  const patientId = event.queryStringParameters && event.queryStringParameters.patientId;

  const params = {
    TableName: process.env.APPOINTMENTS_TABLE,
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    
    // Filter results in code (Simple for small apps)
    // If a patientId was provided, show only theirs. Otherwise show all.
    let appointments = result.Items;
    if (patientId) {
      appointments = appointments.filter(appt => appt.patientId === patientId);
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(appointments),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch appointments' }),
    };
  }
};