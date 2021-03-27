const mysql = require('mysql2');

const connection = mysql.createPool({
  // host: 'localhost',
  host: 'database',
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
