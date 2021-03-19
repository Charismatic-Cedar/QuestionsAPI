const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('../data/exampleData/answers_photos.csv'),
  output: fs.createWriteStream('../data/clean/answers_photos.csv'),
  crlDelay: Infinity,
})

rl.outputError = fs.createWriteStream('../data/filteredUnused/answers_photos.csv')

let photosCount = 0;

rl
  .on('line', (line) => {
    let photo = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

    // If id is not a number
    if (isNaN(photo[0])) {
      rl.outputError.write(`${photo.join(',')}\n`);
      return;
    }

    // If answer id is not a number
    if (isNaN(photo[1])) {
      rl.outputError.write(`${photo.join(',')}\n`);
      return;
    }

    // If url does not exist
    if (!photo[2]) {
      rl.outputError.write(`${photo.join(',')}\n`);
      return;
    }

    photosCount++;
    rl.output.write(`${photo.join(',')}\n`);
  })
  .on('close', () => {
    console.log('Number of lines - photos: ', photosCount);
  })
