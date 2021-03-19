const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('../data/unfiltered/answers.csv'),
  output: fs.createWriteStream('../data/clean/answers.csv'),
  crlDelay: Infinity,
})

rl.outputError = fs.createWriteStream('../data/filteredUnused/answers.csv');

let answersCount = 0;

rl
  .on('line', (line) => {
    let answer = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

    // If id is not a number
    if (isNaN(answer[0])) {
      rl.outputError.write(`${answer.join(',')}\n`);
      return;
    }

    // If question_id is not a number
    if (isNaN(answer[1])) {
      rl.outputError.write(`${answer.join(',')}\n`);
      return;
    }

    // If answer exceeds 1000 characters
    if (answer[2].length < 1 || answer[2].length > 1000) {
      rl.outputError.write(`${answer.join(',')}\n`);
      return;
    }

    // If date does not exist
    if (!answer[3]) {
      rl.outputError.write(`${answer.join(',')}\n`);
      return;
    }

    // If answerer_name does not exist
    if (!answer[4]) {
      rl.outputError.write(`${answer.join(',')}\n`);
      return;
    }

    // If answerer_name is greater than 60 characters
    if (answer[4].length > 60) {
      rl.outputError.write(`${answer.join(',')}\n`);
      return;
    }

    // If email exceeds 60 characters
    if (answer[5].length < 5 || answer[5].length > 60) {
      rl.outputError.write(`${answer.join(',')}\n`);
      return;
    }

    // Reported should be true/false or 0's and 1's (can't be greater than 1)
    if (answer[6] > 1) {
      rl.outputError.write(`${answer.join(',')}\n`);
      return;
    }

    // If helpful is less than zero
    if (answer[7] < 0) {
      rl.outputError.write(`${answer.join(',')}\n`);
      return;
    }

    answersCount++;
    rl.output.write(`${answer.join(',')}\n`);
  })
  .on('close', () => {
    console.log('Number of lines - answers: ', answersCount);
  })
