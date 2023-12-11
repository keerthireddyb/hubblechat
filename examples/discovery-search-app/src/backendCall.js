/* eslint-disable */
import axios from 'axios';
import { formatOutput } from './extractInformation';

const formatRagData = ({ data }, source) => {
  if (data?.answer) data = data.answer;

  const output = formatOutput(data);
  if(typeof output === 'object') output.source = source;
  return output;
};

const backendCall = async (input, source) => {
  try {
    let data;
    let url;
    let response;

    if (source && source !== 'All') {
      data = {
        question: input,
        source,
      }
      url = 'http://20.83.154.168:5000/rag';
      response = await axios.post(url, data);
      console.debug('-----backend call');
      console.debug(response);
      response.data = formatRagData(response, source);
    } else {
      data = {
        text: input
      };
      url = 'http://20.83.154.168:5000/docs';
      response = await axios.post(url, data);
    }

    return response;
  } catch (error) {
    console.error("Error making the backend call: ", error);
    throw error; // Re-throw the error to be caught by the caller if needed
  }
};

export default backendCall