const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('../data/unfiltered/questions.csv'),
  output: fs.createWriteStream('../data/clean/questions.csv'),
  crlDelay: Infinity,
})

rl.outputError = fs.createWriteStream('../data/filteredUnused/questions.csv');

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


// Notes:

// To validate emails:
// const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
// '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
// '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
// '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
// '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
// '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

// function isValidURL(url) {
//   let str = url;
//   // remove surrounding double quotes
//   if (url[0] === '"' && url[0] === url[url.length - 1]) {
//     str = url.substring(1, url.length - 1);
//   }

//   return !!urlPattern.test(str);
// }