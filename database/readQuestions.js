const fs = require('fs');
const readline = require('readline');

// From documentation:
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// rl.question('What do you think of Node.js? ', (answer) => {
//   // TODO: Log the answer in a database
//   console.log(`Thank you for your valuable feedback: ${answer}`);

//   rl.close();
// });

// Plan:
// What defines clean??
// ???? Missing info??? dupes??
// Know what to get rid of... --> how to write code to get rid of
// Then how to write file for new one

const rl = readline.createInterface({
  // input = fs.createReadStream('data/unfiltered/questions.csv'),
  input: fs.createReadStream('../data/exampleData/questions.csv'),
  output: fs.createWriteStream('../data/clean/questions.csv'),
  crlDelay: Infinity,
})

rl.outputError = fs.createWriteStream('../data/filteredUnused/questions.csv');

// Quote check if anything is string
// Duplicates?

let questionsCount = 0;

rl
  .on('line', (line) => {
    let question = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

    // If id is not a number
    if (isNaN(question[0])) {
      rl.outputError.write(`${question.join(',')}\n`);
      return;
    }

    // If product_id is not a number
    if (isNaN(question[1])) {
      rl.outputError.write(`${question.join(',')}\n`);
      return;
    }

    // If question length exceeds max length
    if (question[2].length < 1 || question[2].length > 1000) {
      rl.outputError.write(`${question.join(',')}\n`);
      return;
    }

    // If date does not exist
    if (!question[3]) {
      rl.outputError.write(`${question.join(',')}\n`);
      return;
    }

    // If asker_name does not exist
    if (!question[4]) {
      rl.outputError.write(`${question.join(',')}\n`);
      return;
    }

    // If asker_name is exceeds 60 characters
    if (question[4].length > 60) {
      rl.outputError.write(`${question.join(',')}\n`);
      return;
    }

    // If email exceeds 60 characters
    if (question[5].length < 5 || question[5].length > 60) {
      rl.outputError.write(`${question.join(',')}\n`);
      return;
    }

    // Reported should be true or false or 0 and 1 (can't be greater than 1)
    if (question[6] > 1) {
      rl.outputError.write(`${question.join(',')}\n`);
      return;
    }


    // If helpful is less than zero
    if (question[7] < 0) {
      rl.outputError.write(`${question.join(',')}\n`);
      return;
    }

    questionsCount++;
    rl.output.write(`${question.join(',')}\n`);
  })
  .on('close', () => {
    console.log('Number of lines - questions: ', questionsCount);
  })
