const express = require('express');
const path = require('path');
const axios = require('axios');
const db = require('../database/sqlConnection.js');

const app = express();
const port = 3200;

app.use(express.json());

// Create helper promise function
const getQuestions = (product_id) => {
  const questionSqlQuery = `SELECT * FROM questions WHERE product_id = ${product_id};` // Need work
  return new Promise ((resolve, reject) => {
    db.connection.query(questionSqlQuery, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    })
  })
}

const getAnswers = () => {

}

const getPhotos = () => {

}


// Get request for questions
app.get('/qa/questions', ((request, response) => {
  const { product_id } = req.query;

  getQuestions(product_id)
    // .then((result) => {

    // })

    // .then
    // Grab the question_id
      // Loop through result... grab each question_id --> promise
    // pass question id into getAnswers
    // then
    // grab answer id --> getPhotos
    // (Can do individual promise then use promise.all)


  // return new Promise
}))





// Get request for answers
app.get('/qa/questions/:question_id/answers', ((request, response) => {
  // const { question_id } = ;
  const answerSqlQuery = 'SELECT * FROM answers WHERE question_id = ;' // Need work as well
  db.query(answerSqlQuery, (error, result) => {
    if (error) {
      console.log('Error retrieving answers from database: ', error);
      response.sendStatus(500);
    } else {
      console.log('Successfully retrieved answers from database');
      response.send(result);
    }
  })
}))

// Post request for adding a question
app.post('/qa/questions', ((request, response) => {
  // What do I need???? product id, question id, or both?
  const postQuestionQuery = ''; // ??
  db.query(postQuestionQuery, (error, result) => {
    if (error) {
      console.log('Error posting question to database: ', error);
      response.sendStatus(500);
    } else {
      console.log('Successfully posted question to database: ', result);
      response.sendStatus(201);
    }
  })
}))

// Post request for answers
app.post('/qa/questions/:question_id/answers', ((request, response) => {
  const postAnswerQuery = ''; // ??
  db.query(postAnswerQuery, (error, result) => {
    if (error) {
      console.log('Error posting answer to database: ', error);
      response.sendStatus(500);
    } else {
      console.log('Successfully posted question to database: ', result);
      response.sendStatus(201);
    }
  })
}))

// Put request for question helpfulness
app.put('/qa/questions/:question_id/helpful', ((request, response) => {
  const helpfulQuestionQuery = ''; // ??
  db.query(helpfulQuestionQuery, (error, result) => {
    if (error) {
      console.log('Error updating database - question helpfulness: ', error);
      response.sendStatus(500);
    } else {
      console.log('Successfully updated database - question helpfulness');
      response.sendStatus(204);
    }
  })
}))

// Put request for question reporting
app.put('/qa/questions/:question_id/report', ((request, response) => {
  const reportQuestionQuery = ''; // ??
  db.query(reportQuestionQuery, (error, result) => {
    if (error) {
      console.log('Error updating database - question reporting: ', error);
      response.sendStatus(500);
    } else {
      console.log('Successfully updated database - question reporting');
      response.sendStatus(204);
    }
  })
}))

// Put request for answer helpfulness
app.put('/qa/answers/:answer_id/helpful', ((request, response) => {
  const helpfulAnswerQuery = ''; // ??
  db.query(helpfulAnswerQuery, (error, result) => {
    if (error) {
      console.log('Error updating database - answer helpfulness: ', error);
      response.sendStatus(500);
    } else {
      console.log('Successfully updated database - answer helpfulness');
      response.sendStatus(204);
    }
  })
}))

// Put request for answer reporting
app.put('/qa/answers/:answer_id/report', ((request, response) => {
  const reportAnswerQuery = ''; // ??
  db.query(reportAnswerQuery, (error, result) => {
    if (error) {
      console.log('Error updating database - answer reporting: ', error);
      response.sendStatus(500);
    } else {
      console.log('Successfully updated database - answer reporting');
      response.sendStatus(204);
    }
  })
}))


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


let questionsResponse = {};
getQuestions(14034)
  .then((result) => {
    console.log(result)
    result.forEach(({ id, body, date_written, asker_name, helpful, reported }) => {

      let questionTableData = {
        question_id: id,
        question_body: body,
        question_date: date_written,
        asker_name: asker_name,
        question_helpfulness: helpful,
        reported: !!reported
      };

      console.log('THIS IS QUESTION TABLE DATA', questionTableData);


    })
  })
  .catch((error) => {
    console.log('getQuestions: ', error);
  })