const mysql = require('mysql2');

const connection = mysql.createPool({
  // host: 'localhost',
  // host: 'database',
  user: 'root',
  password: 'hackreactor',
  database: 'questionsAnswers',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// connection.connect((err) => {
//   if (err) {
//     console.log('Error connecting to MySQL: ', err);
//   } else {
//     console.log('Connected to MySQL');
//   }
// });

module.exports.connection = connection;

// scp -i SDC.pem ./app/data/clean/answers.csv ubuntu@ec2-52-53-208-239.us-west-1.compute.amazonaws.com:data;

// ssh -i "SDC.pem" ubuntu@ec2-52-53-208-239.us-west-1.compute.amazonaws.com