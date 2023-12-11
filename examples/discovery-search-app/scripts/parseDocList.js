const axios = require('axios').default;
const { formatOutput } = require('../src/extractInformation');
const confidentProbability = 0.4;

const getRagData = async (input, question) => {
  let result = { data: 'An error occurred' };
  const payload = {
    question,
    source: input.source
  };

  try {
    result = await axios.post('http://20.83.154.168:5000/rag', payload);
    return result.data;
  } catch (err) {
    console.error(`Error retrieving rag data`);
    console.error(err);
    return result;
  }
};
const formatRagData = data => {
  if (data?.answer) data = data.answer;

  return formatOutput(data);
};

// 3 paths: 1) high probability - call /rag 2) mid probabilities - return array of inputs and let user pick
// 3) Low probability - prompt user for clarification
const determineAction = async (inputArray, question) => {
  let ragData;

  if (inputArray.length === 1 && inputArray.source !== 'NA') {
    if (!inputArray[0]?.probability) {
      return 'Can you clarify?';
    } else if (inputArray[0]?.probability > confidentProbability) {
      ragData = await getRagData(inputArray[0], question);
      console.debug('------Raw rag data at parseDocList.js---------');
      console.debug(ragData);
      if (ragData?.answer) {
        const output = formatRagData(ragData);
        return output;
      }
      return JSON.stringify(ragData);
    }
  }

  console.debug(`Returning ${JSON.stringify(inputArray)}`);
  return inputArray;
};

const parseDocList = inputArray => {
  // New array to store objects with probability above .40

  const newArray = [];
  const defaultMessage = [{ source: 'NA' }];

  // Sort array by probability
  inputArray.sort((a, b) => {
    if (a.probability > b.probability) return -1;
    if (a.probability > b.probability) return 1;
    return 0;
  });

  for (let i = 0; i < inputArray.length; i++) {
    // Return and use highest probability input if exceed confident probability
    if (i === 0 && inputArray[i]?.probability > confidentProbability) {
      newArray.push(inputArray[i]);
      return newArray;
    }
    // Check if the probability is above 0.40
    if (inputArray[i]?.probability > 0.1) {
      // Push the object to the new array
      newArray.push(inputArray[i]);
    }
  }

  // Print and return the new array
  console.log(newArray);
  if (newArray.length >= 1) {
    return newArray;
  } else {
    return defaultMessage;
  }
};

module.exports = {
  determineAction,
  parseDocList
};
