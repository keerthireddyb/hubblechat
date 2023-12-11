/* eslint-disable */

const express = require('express');
const app = express();
const cors = require('cors'); // Cross-site authorization
const retrieveDocs = require('./retrieveDocs');
const retrieveRag = require('./retrieveRag');
const watsonxAuth = require('./watsonxAuth');
const { parseDocList, determineAction } = require('./scripts/parseDocList');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post('/docs', async (req, res) => {
  try {
    console.log('You have successfully hit the DOCs endpoint');
    let result = '';
    const classification = await watsonxAuth(req.body.text);
    console.log('Classification: ' + JSON.stringify(classification));
    switch (classification) {
      case '"Greeting"':
        result = 'Hello, how can I help you?';
        break;
      case '"Source"':
        result = 'Changing source...';
        break;
      case '"Query"':
        result = await retrieveDocs(req.body.text);
        break;
      case '"Positive"':
        result = 'Anything else I can help you with?';
        break;
      case '"Negative"':
        result = "I'm sorry, I can check a different source";
        break;
    }

    console.log('RESULT AT SERVER.JS:' + JSON.stringify(result));

    let action;
    if (typeof result === 'string') {
      return res.status(200).send(result);
    }

    try {
      const resultList = parseDocList(result);
      console.debug(`result list: ${JSON.stringify(resultList)}`);
      action = await determineAction(resultList, req.body.text);

      console.debug(`Action @ watsonxServer: ${JSON.stringify(action)}`);
    } catch (err) {
      console.error(err);
    }

    res.status(200).send(action);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/rag', async (req, res) => {
  try {
    console.log('You have successfully hit the RAG endpoint');
    const result = await retrieveRag(req.body);
    console.log('RESULT' + JSON.stringify(result));
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log('Server started successfully on ' + port);
});
