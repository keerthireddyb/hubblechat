const axios = require('axios');
const watsonxAi = require('./watsonxAI');

async function watsonxAuth(data) {
  try {
    // IAM API key
    //****** DONT LEAVE THIS HERE *****
    const iamApiKey = 'Lc24e0442RMO2iTlxxU0rSZzug9MAezyjRY_d_5q9Jrh';

    // IAM token endpoint
    const tokenUrl = 'https://iam.cloud.ibm.com/identity/token';

    // Request body to obtain IAM token
    const tokenRequestBody = `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${iamApiKey}`;

    const response = await axios.post(tokenUrl, tokenRequestBody, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const iamToken = response.data.access_token;
    //console.log(iamToken)

    // Now that you have the IAM token, proceed to make the API request.
    const watsonxRes = await watsonxAi(iamToken, data);
    //const watsonxRes = "\"Query\"";
    return watsonxRes;
  } catch (error) {
    console.error('Error obtaining IAM token:', error);
    throw error; // You can rethrow the error or handle it as needed
  }
}

module.exports = watsonxAuth;
