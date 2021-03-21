const express = require('express');
const path = require('path');
const axios = require('axios');
const db = require('../database/sqlConnection.js');

const app = express();
const port = 3200;

app.use(express.json());

const getQuestions = (productId) => {
  const sqlQuery = `SELECT *, questions.question_id FROM questions LEFT JOIN answers ON (questions.question_id = answers.question_id) LEFT JOIN photos ON (answers.answer_id = photos.a_id) WHERE product_id = ${productId};`;
  // SELECT * FROM questions LEFT JOIN answers ON (questions.question_id = answers.question_id) LEFT JOIN photos ON (answers.answer_id = photos.answer_id) WHERE product_id = 304558;
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
  // return questionObject;
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
  // return answerObject;
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
        let questions = tableData[i];
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
        } = questions;

        if (previousQuestionID !== question_id) {
          let questionObject = questionBuilder(questions);
          if (answer_id) {
            let answerObject = answerBuilder(questions);
            questionObject.answers[`${answer_id}`] = answerObject;
            if (photo_id) {
              questionObject.answers[`${answer_id}`].photos.push(photoBuilder(questions));
            }
          }
          questionsResponse.results.push(questionObject);
          previousQuestionID = question_id;
          questionCount++;
        } else {
          if (answer_id) {
            let answerObject = answerBuilder(questions);
            let currentAnswers = questionsResponse.results[questionCount - 1].answers;
            if (previousAnswerID !== answer_id) {
              if (photo_id) {
                answerObject.photos.push(photoBuilder(questions));
                previousAnswerID = answer_id;
              }
            } else {
              if (photo_id) {
                answerObject = questionsResponse.results[questionCount - 1].answer[previousAnswerID];
                answerObject.photos.push(photoBuilder(questions));
              }
              // if (photo_id) {
                //   questionsResponse.results[questionCount - 1].answers[answer_id].photos.push(photoBuilder(questions));
            }
            questionsResponse.results[questionCount - 1].answers[`${answer_id}`] = answerObject;
          }
        }
      }
      // response.send(tableData);
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


// Experimentation:

// // Get request for questions
// app.get('/qa/questions', ((request, response) => {
//   // const product_id = 304588; // 14034
//   const { product_id } = request.query;
//   let
// }))


// // const product_id = 14034;
// const { product_id } = request.query;
// let questionsResponse = {
//   product_id: product_id,
//   results: [],
// };
// getQuestions(product_id)
// .then((result) => {
//     result.forEach(({ id, body, date_written, asker_name, helpful, reported }) => {
//       let questionTableData = {
//         question_id: id,
//         question_body: body,
//         question_date: date_written,
//         asker_name: asker_name,
//         question_helpfulness: helpful,
//         reported: !!reported,
//         answers: {}
//       };
//       let answerTableData = {};
//       getAnswers(questionTableData.question_id)
//       .then((answerResult) => {
//         // response.send(answerResult);
//         // console.log('questionTableData: ', questionTableData);
//         // console.log('THIS IS ANSWER RESULT: ', answerResult);
//           // if (answerResult.length !== 0) {
//           answerResult.forEach((answer, index) => {
//             // { id, question_id, body, date_written, answerer_name, answerer_email, reported, helpfulness }
//               answerTableData = {
//               id: answer.id,
//               body: answer.body,
//               date: answer.date_written,
//               answerer_name: answer.answerer_name,
//               helpfulness: answer.helpfulness,
//               photos: []
//             };
//             questionTableData.answers[ `${answer.id}` ] = answerTableData;
//             return questionTableData;
//           })
//           // }
//           // console.log('this is answer table data: ', answerTableData);
//       })
//       .then((ret) => {
//         questionsResponse.results.push(questionTableData);
//         console.log(questionsResponse);
//       })
//       // console.log(questionTableData, 'QUESTION RESPONSE LINE 95');
//     })
//     response.send(questionsResponse);
//   })
//   .catch((error) => {
//     console.log('Error with getQuestions: ', error);
//   })




//   // .then((result) => {

//   // })

//   // .then
//   // Grab the question_id
//     // Loop through result... grab each question_id --> promise
//   // pass question id into getAnswers
//   // then
//   // grab answer id --> getPhotos
//   // (Can do individual promise then use promise.all)


// // return new Promise

// Create helper promise function
// const getQuestions = (product_id) => {
//   const questionSqlQuery = `SELECT * FROM questions WHERE product_id = ${product_id};`
//   return new Promise ((resolve, reject) => {
//     db.connection.query(questionSqlQuery, (error, result) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(result);
//       }
//     })
//   })
// }

// const getAnswers = (question_id) => {
//   const answerSqlQuery = `SELECT * FROM answers WHERE question_id = ${question_id};`
//   return new Promise ((resolve, reject) => {
//     db.connection.query(answerSqlQuery, (error, result) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(result);
//       }
//     })
//   })
// }


// If block experimentation:

// if (i !== 0) {
//   if (questions.question_id === tableData[i - 1].question_id) {
//     let answerObject = answerBuilder(questions);
//     questionObject.answers[`${answer_id}`] = answerObject;
//   } else {
//     let questionObject = {
//       question_id: question_id,
//       question_body: body,
//       question_date: date_written,
//       asker_name: asker_name,
//       question_helpfulness: helpful,
//       reported: reported,
//       answers: {}
//     }
//     console.log('Line 91: ', questions);
//     let answerObject = answerBuilder(questions);
//     questionObject.answers[`${answer_id}`] = answerObject;
//     // console.log(questionObject);
//   }
// } else {
//   let questionObject = {
//     question_id: question_id,
//     question_body: body,
//     question_date: date_written,
//     asker_name: asker_name,
//     question_helpfulness: helpful,
//     reported: reported,
//     answers: {}
//   }
//   console.log('Question object: ', questionObject);
//   let answerObject = answerBuilder(questions);
//   questionObject.answers[`${answer_id}`] = answerObject;
// }


// if (previousQuestionID === tableData[i - 1].question_id) {
//   let answerObject = answerBuilder(questions);
//   console.log('Answer obj if same question id: ', answerObject);
//   // How do I access prior question obect??

// } else {
//   let questionObject = questionBuilder(questions);
//   let answerObject = answerBuilder(questions);
//   questionObject.answers[`${answer_id}`] = answerObject;
// }
// } else {
// previousQuestionID = questions.question_id;

// let questionObject = questionBuilder(questions);
// let answerObject = answerBuilder(questions);
// questionObject.answers[`${answer_id}`] = answerObject;
// console.log('Question Obj: ', questionObject);
// }