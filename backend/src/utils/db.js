const AWS = require('aws-sdk');
// Performance Boost
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoDb;