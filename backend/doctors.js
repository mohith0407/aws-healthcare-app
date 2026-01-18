const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.DOCTORS_TABLE || 'healthcare-api-dev-doctors';

module.exports.list = async (event) => {
  try {
    const params = { TableName: TABLE_NAME };
    const result = await dynamoDb.scan(params).promise();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch doctors' }),
    };
  }
};

module.exports.create = async (event) => {
  const data = JSON.parse(event.body);
  
  const params = {
    TableName: TABLE_NAME,
    Item: {
      id: data.id,
      name: data.name,
      specialization: data.specialization,
      image: data.image,
      fee: data.fee,
      experience: data.experience
    },
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(params.Item),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not create doctor' }),
    };
  }
};