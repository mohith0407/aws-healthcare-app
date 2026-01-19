const AWS = require('aws-sdk');
const ses = new AWS.SES();
const dynamo = new AWS.DynamoDB.DocumentClient();

const DOCTORS_TABLE = process.env.DOCTORS_TABLE;

exports.handler = async (event) => {
  const { sub, email, name, phone_number } = event.request.userAttributes;
  const role = event.request.userAttributes['custom:role'];
  const specialization = event.request.userAttributes['custom:specialization'];

  // 1. If user is a DOCTOR, save to DynamoDB
  if (role === 'doctor') {
    const doctorProfile = {
      id: sub, // Use Cognito ID as the Database Key
      name,
      email,
      specialization,
      phone: phone_number,
      createdAt: new Date().toISOString(),
      isApproved: false // Admin must approve later (optional feature)
    };

    try {
      await dynamo.put({
        TableName: DOCTORS_TABLE,
        Item: doctorProfile
      }).promise();
      console.log("Doctor Profile Created in DynamoDB");
    } catch (err) {
      console.error("Error creating doctor profile:", err);
    }

    // 2. Send Alert Email (Your existing code)
    const MY_VERIFIED_EMAIL = 'YOUR_VERIFIED_EMAIL@gmail.com'; 
    const params = {
      Source: MY_VERIFIED_EMAIL,
      Destination: { ToAddresses: [MY_VERIFIED_EMAIL] },
      Message: {
        Subject: { Data: 'New Doctor Registration' },
        Body: { Text: { Data: `Approve Doctor: ${name} (${specialization})` } }
      }
    };
    try {
      await ses.sendEmail(params).promise();
    } catch (err) { console.error("Email Error:", err); }
  }

  return event;
};