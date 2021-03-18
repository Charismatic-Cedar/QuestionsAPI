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
  input = fs.createReadStream('data/unfiltered/questions.csv'),
  output = fs.createWriteStream('data/clean/questions.csv'),
  crlDelay: Infinity,
})

rl
  .on('line', (line) => {
    let question = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    rl.output.write(`${question.join(',')}\n`);
  });
