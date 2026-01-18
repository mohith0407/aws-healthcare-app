const formatResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(body),
  };
};

module.exports = {
  success: (data) => formatResponse(200, data),
  error: (code, message) => formatResponse(code, { error: message }),
};