const axios = require('axios');

const retrieveRag = async obj => {
  let q = obj.question;
  let s = obj.source;
  let data = JSON.stringify({
    question: q,
    source: s
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://hubbel.19rbmx2glrnh.us-south.codeengine.appdomain.cloud/rag',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };

  const res = await axios.request(config);
  console.log('RESPONSE AT RETRIEVE RAG: ' + JSON.stringify(res.data));
  return res.data;
};

module.exports = retrieveRag;
