/* eslint-disable */
const extractInformation = (inputString) => {
  // Define regular expressions for each pattern
  const sourceDocumentRegex = /Source\s*[_]*\s*Document: ([^\n]*)/gi;
  const answerRegex = /Answer: ([\s\S]*?)(?=(Source Document:|Answer:|Page Number:|$))/g;
  const pageNumberRegex = /Page\s*[_]*\s*Number: ([^\n]*)/gi;

  // Function to extract matches from a regex and return an array of objects
  const extractMatches = (regex, groupName) => {
    const matches = [];
    let match;
    while ((match = regex.exec(inputString)) !== null) {
      matches.push({ [groupName]: match[1] });
    }
    return matches;
  };

  // Extract information using regular expressions
  const sourceDocumentMatches = extractMatches(sourceDocumentRegex, 'sourceDocument');
  const answerMatches = extractMatches(answerRegex, 'answer');
  const pageNumberMatches = extractMatches(pageNumberRegex, 'pageNumber');

  // Return the extracted information
  return sourceDocumentMatches.map((_, index) => ({
    sourceDocument: sourceDocumentMatches[index]?.sourceDocument || null,
    answer: answerMatches[index]?.answer || null,
    pageNumber: pageNumberMatches[index]?.pageNumber || null,
  }));
};

const extractLeftoverText = (str, regexArray) => {
  let leftoverText = str;

  regexArray.forEach((regex) => {
    leftoverText = leftoverText.replace(regex, (match) => '');
  });

  return leftoverText;
};

const formatOutput = (data) => {
  let output = '';
  let source = '';
  const seenAnswers = [];
  const trimAnswer = (answer) => answer.replace(/^\n+|\n+$/g, '');
  const infoList = extractInformation(data);
  console.debug('@extractInformation--------');
  console.debug(infoList);
  if (!infoList || !infoList.length) return trimAnswer(data);

  const sourceDocumentRegex = /Source\s*[_]*\s*Document: ([^\n]*)/gi;
  const pageNumberRegex = /Page\s*[_]*\s*Number: ([^\n]*)/gi;


  for (let idx = 0; idx < infoList.length; idx += 1) {
    const { answer, sourceDocument, pageNumber } = infoList[idx];

    if (idx === 0 && !answer) {
      const leftoverText = trimAnswer(extractLeftoverText(data, [sourceDocumentRegex, pageNumberRegex]));
      source = sourceDocument;
      output = `${leftoverText}\n\nSource Document: ${sourceDocument}, page ${pageNumber}\n\n\n`;
      break;
    }

    if (!answer) continue;

    const trimmedAnswer = trimAnswer(answer);
    source = sourceDocument;
    if (!seenAnswers.includes(trimmedAnswer))
      output += `${trimmedAnswer}\n\nSource Document: ${sourceDocument}, page ${pageNumber}\n\n\n`;
    seenAnswers.push(trimmedAnswer);
  }

  const trimmedOutput = trimAnswer(output);

  return {
    source,
    answer: trimmedOutput
  };
}

module.exports = { formatOutput };
