const axios = require('axios');

async function watsonxAi(iamToken, info) {
  try {
    let comment = JSON.stringify(info);
    console.log('COMMENT :' + comment);

    let data = JSON.stringify({
      model_id: 'google/flan-ul2',
      input:
        'Based on the human input classify the input into one of the following "Query", "Greeting", "Positive", "Negative", "Source": \n\nInput: Hey\nOutput: "Greeting"\n\nInput: Thanks!\nOutput: "Positive"\n\nInput: What is the maintenance schedule?\nOutput: "Query"\n\nInput: How to change pneumatic tubes?\nOutput: "Query"\n\nInput: Color of annealing \nOutput: "Query"\n\nInput: That\'s not right\nOutput: "Negative"\n\nInput: change the source \nOutput: "Source"\n\nInput: try another manual\nOutput: "Source"\n\nInput: wrong manual\nOutput: "Source"\n\nInput: ' +
        comment +
        '"\nOutput: ',
      parameters: {
        decoding_method: 'greedy',
        max_new_tokens: 20,
        min_new_tokens: 0,
        stop_sequences: [],
        repetition_penalty: 1
      },
      project_id: '6deb381c-4d23-40bd-95bc-4eaf56389f73'
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://us-south.ml.cloud.ibm.com/ml/v1-beta/generation/text?version=2023-05-28',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${iamToken}`
      },
      data: data
    };

    const response = await axios.request(config);

    // console.log("----WATSONX-------");
    // console.log(JSON.stringify(response.data));
    // console.log("=========================");
    const nlpRes = JSON.stringify(response.data.results[0].generated_text);
    //console.log(nlpRes);

    return nlpRes;
  } catch (error) {
    console.error(error);
    throw error; // You can rethrow the error or handle it as needed
  }
}

module.exports = watsonxAi;
