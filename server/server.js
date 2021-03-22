const express = require('express');
const path = require('path');
const axios = require('axios');
const db = require('../database/sqlConnection.js');

const app = express();
const port = 3200;

app.use(express.json());

const getSqlData = (item, id, reported) => {
  const sqlQuery = `SELECT *, questions.question_id FROM questions LEFT JOIN answers ON (questions.question_id = answers.question_id) LEFT JOIN photos ON (answers.answer_id = photos.a_id) WHERE ${item} = ${id} AND ${reported} = false;`;
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

let questionsAnswerBuilder = ({ answer_id, answerBody, answerDate, answerer_name, helpfulness }) => {
  return {
    id: answer_id,
    body: answerBody,
    date: answerDate,
    answerer_name: answerer_name,
    helpfulness: helpfulness,
    photos: [],
  };
}

let answerBuilder = ({ answer_id, answerBody, answerDate, answerer_name, helpfulness }) => {
  return {
    answer_id: answer_id,
    body: answerBody,
    date: answerDate,
    answerer_name: answerer_name,
    helpfulness: helpfulness,
    photos: [],
  }
}

let photoBuilder = ({ photo_id, photoURLS }) => {
  return {
    id: photo_id,
    url: photoURLS
  };
}

let postRequestValidator = ({ body, name, email }) => {
  if (body.length > 1000) {
    response.sendStatus(404);
  }
  if (name.length > 60) {
    response.sendStatus(404);
  }
  if (email.length < 5 || email.length > 60) {
    response.sendStatus(404);
  }
}

// Get request for questions
app.get('/qa/questions', ((request, response) => {
  // let product_id = 5;
  let { product_id } = request.query;
  getSqlData('product_id', product_id, 'reported')
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
          answer_id,
          photo_id,
        } = currentQuestion;
        if (question_id !== previousQuestionID) {
          let questionObject = questionBuilder(currentQuestion);
          previousQuestionID = question_id;
          questionCount++;
          if (answer_id) {
            let answerObject = questionsAnswerBuilder(currentQuestion);
            questionObject.answers[`${answer_id}`] = answerObject;
            previousAnswerID = answer_id;
            if (photo_id) {
              let currentPhoto = photoBuilder(currentQuestion);
              questionObject.answers[`${answer_id}`].photos.push(currentPhoto);
            }
          }
          questionsResponse.results.push(questionObject);
        } else {
          let answerObject = questionsAnswerBuilder(currentQuestion);
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
      // response.send(questionsResponse);
      response.send(tableData);
    })
    .catch((error) => {
      console.log('Error retrieving questions: ', error);
      response.status(500).send(error);
    })
}))

// Get request for answers
app.get('/qa/questions/:question_id/answers', ((request, response) => {
  // let question_id = 34;
  let { question_id } = request.params;
  const { page, count } = request.query;
  getSqlData('answers.question_id', question_id, 'reportedAnswer')
    .then((answerData) => {
      let previousAnswerID = 0;
      let answerCount = 0;
      let answersResponse = {
        question: answerData[0].question_id,
        page: page || 1,
        count: count || 100,
        results: [],
      };
      for (let i = 0; i < answerData.length; i++) {
        let currentAnswer = answerData[i];
        let {
          answer_id,
          photo_id,
          photoURLS,
        } = currentAnswer;
        if (answer_id !== previousAnswerID) {
          let answerObject = answerBuilder(currentAnswer);
          if (photo_id) {
            answerObject.photos.push(photoBuilder(currentAnswer));
          }
          answersResponse.results.push(answerObject);
          previousAnswerID = answer_id;
          answerCount++;
        } else {
          answersResponse.results[answerCount - 1].photos.push(photoBuilder(currentAnswer));
        }
      }
      response.send(answersResponse);
    })
    .catch((error) => {
      console.log('Error retrieving answers: ', error);
      response.status(500).send(error);
    })
}))

// Post request for adding a question
app.post('/qa/questions', ((request, response) => {
  let { body, name, email, product_id } = request.body;
  postRequestValidator(request.body);
  const postQuestionQuery = `INSERT INTO questions (product_id, body, asker_name, asker_email) VALUES (?, ?, ?, ?)`;
  db.connection.query(postQuestionQuery, [product_id, body, name, email], (error, result) => {
    if (error) {
      console.log('Error posting question to database: ', error);
      response.status(500).send(error);
    } else {
      console.log('Successfully posted question to database');
      response.sendStatus(201);
    }
  })
}))

// Post request for answers
app.post('/qa/questions/:question_id/answers', ((request, response) => {
  let { body, name, email, photos } = request.body;
  let { question_id } = request.params;
  postRequestValidator(request.body);
  const postAnswerQuery = `INSERT INTO answers (question_id, answerBody, answerer_name, answerer_email) VALUES (${question_id}, "${body}", "${name}", "${email}");`;
  return new Promise ((resolve, reject) => {
    db.connection.query(postAnswerQuery, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
        console.log('Successfully posted answer');
      }
    })
  })
    .then((res) => {
      let answerID = res.insertId;
      if (photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
          let photoQuery = `INSERT INTO photos (a_id, photoURLS) VALUES (${answerID}, "${photos[i]}");`;
          db.connection.query(photoQuery, (err, res) => {
            if (err) {
              console.log('Error posting photos to database: ', err);
              response.sendStatus(500);
            } else {
              console.log('Successfully posted photos');
              response.sendStatus(201);
            }
          })
        }
      } else {
        response.sendStatus(201);
      }
    })
}))

// Put request for question helpfulness
app.put('/qa/questions/:question_id/helpful', ((request, response) => {
  const { question_id } = request.params;
  const helpfulQuestionQuery = `UPDATE questions SET helpful = helpful + 1 WHERE question_id = ${question_id};`;
  db.connection.query(helpfulQuestionQuery, (error, result) => {
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
  const { question_id } = request.params;
  const reportQuestionQuery = `UPDATE questions SET reported = true WHERE question_id = ${question_id};`;
  db.connection.query(reportQuestionQuery, (error, result) => {
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
  const { answer_id } = request.params;
  const helpfulAnswerQuery = `UPDATE answers SET helpfulness = helpfulness + 1 WHERE answer_id = ${answer_id};`;
  db.connection.query(helpfulAnswerQuery, (error, result) => {
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
  const { answer_id } = request.params;
  const reportAnswerQuery = `UPDATE answers SET reportedAnswer = true WHERE answer_id = ${answer_id};`;
  db.connection.query(reportAnswerQuery, (error, result) => {
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
