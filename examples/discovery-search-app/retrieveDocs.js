const axios = require('axios');

const retrieveDocs = async message => {
  let data = JSON.stringify({
    question: message
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://hubbel.19rbmx2glrnh.us-south.codeengine.appdomain.cloud/docs',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };

  console.log('Message at retrieve docs: ' + message);
  const response = await axios.request(config);
  return response.data;
};

module.exports = retrieveDocs;
