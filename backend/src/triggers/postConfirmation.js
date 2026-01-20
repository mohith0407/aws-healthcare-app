const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

// Initialize Clients
const sesClient = new SESClient();
const dbClient = new DynamoDBClient();
const dynamo = DynamoDBDocumentClient.from(dbClient);

const DOCTORS_TABLE = process.env.DOCTORS_TABLE || 
'healthcare-api-dev-doctors';

exports.handler = async (event) => {
  console.log("EVENT:", JSON.stringify(event, null, 2)); // Good for debugging

  const { sub, email, name, phone_number } = event.request.userAttributes;
  const role = event.request.userAttributes['custom:role'];
  const specialization = event.request.userAttributes['custom:specialization'];

  if (role === 'doctor') {
    // 1. Save to DynamoDB
    const doctorProfile = {
      id: sub,
      name,
      email,
      specialization,
      phone: phone_number,
      createdAt: new Date().toISOString(),
      isApproved: false
    };

    try {
      await dynamo.send(new PutCommand({
        TableName: DOCTORS_TABLE,
        Item: doctorProfile
      }));
      console.log("SUCCESS: Doctor saved to DynamoDB");
    } catch (err) {
      console.error("ERROR: Failed to save to DynamoDB", err);
    }

    // 2. Send Alert Email
    const MY_VERIFIED_EMAIL = 'mohith.dev0407@gmail.com'; 
    try {
      await sesClient.send(new SendEmailCommand({
        Source: MY_VERIFIED_EMAIL,
        Destination: { ToAddresses: [MY_VERIFIED_EMAIL] },
        Message: {
          Subject: { Data: 'New Doctor Registration' },
          Body: { Text: { Data: `Approve Doctor: ${name} (${specialization})` } }
        }
      }));
      console.log("SUCCESS: Email sent");
    } catch (err) {
      console.error("ERROR: Failed to send email", err);
    }
  }

  return event; // Mandatory!
};