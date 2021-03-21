const express = require('express');
const path = require('path');
const axios = require('axios');
const db = require('../database/sqlConnection.js');

const app = express();
const port = 3200;

app.use(express.json());

const getQuestions = (productId) => {
  const sqlQuery = `SELECT *, questions.question_id FROM questions LEFT JOIN answers ON (questions.question_id = answers.question_id) LEFT JOIN photos ON (answers.answer_id = photos.a_id) WHERE product_id = ${productId};`;
  return new Promise ((resolve, reject) => {
    db.connection.query(sqlQuery, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    })
  })
}


let questionBuilder = ({ question_id, body, date_written, asker_name, helpful, reported }) => {
  return {
    question_id: question_id,
    question_body: body,
    question_date: date_written,
    asker_name: asker_name,
    question_helpfulness: helpful,
    reported: reported,
    answers: {}
  }
}

let answerBuilder = ({ answer_id, answerBody, answerDate, answerer_name, reportedAnswer, helpfulness }) => {
  return {
    id: answer_id,
    body: answerBody,
    date: answerDate,
    answerer_name: answerer_name,
    helpfulness: helpfulness,
    photos: [],
  };
}

let photoBuilder = ({ photo_id, photoURLS }) => {
  return {
    id: photo_id,
    url: photoURLS
  };
}


// Get request for questions
app.get('/qa/questions', ((request, response) => {
  const { product_id } = request.query;
  getQuestions(product_id)
    .then((tableData) => {
      let previousQuestionID = 0;
      let previousAnswerID = 0;
      let questionCount = 0;
      let questionsResponse = {
        product_id: tableData[0].product_id,
        results: [],
      };

      for (let i = 0; i < tableData.length; i++) {
        let currentQuestion = tableData[i];
        let {
          question_id,
          product_id,
          body,
          date_written,
          asker_name,
          asker_email,
          reported,
          helpful,
          answer_id,
          answerBody,
          answerDate,
          answerer_name,
          answerer_email,
          reportedAnswer,
          helpfulness,
          photo_id,
          photoURLS
        } = currentQuestion;

        if (question_id !== previousQuestionID) {
          let questionObject = questionBuilder(currentQuestion);
          previousQuestionID = question_id;
          questionCount++;
          if (answer_id) {
            let answerObject = answerBuilder(currentQuestion);
            questionObject.answers[`${answer_id}`] = answerObject;
            previousAnswerID = answer_id;
            if (photo_id) {
              let currentPhoto = photoBuilder(currentQuestion);
              questionObject.answers[`${answer_id}`].photos.push(currentPhoto);
            }
          }
          questionsResponse.results.push(questionObject);
        } else {
          // If same as prior question id
          let answerObject = answerBuilder(currentQuestion);
          if (answer_id !== previousAnswerID) {
            if (photo_id) {
              answerObject.photos.push(photoBuilder(currentQuestion));
            }
            questionsResponse.results[questionCount - 1].answers[`${answer_id}`] = answerObject;
            previousAnswerID = answer_id;
          } else {
            questionsResponse.results[questionCount - 1].answers[previousAnswerID].photos.push(photoBuilder(currentQuestion));
          }
        }
      }
      response.send(questionsResponse);
    })
    .catch((error) => {
      console.log('Error retrieving questions from database: ', error);
      response.status(500).send(error);
    })
}))

// Get request for answers
app.get('/qa/questions/:question_id/answers', ((request, response) => {
  // const { question_id } = ;

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
