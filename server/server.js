const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const port = 3200;

app.use(express.json());

// Get request for questions
app.get('/qa/questions', ((request, response) => {
  response.sendStatus(200);
}))

// Get request for answers
app.get('/qa/questions/:question_id/answers', ((request, response) => {
  response.sendStatus(200);
}))

// Post request for adding a question
app.post('/qa/questions', ((request, response) => {
  response.sendStatus(201);
}))

// Post request for answers
app.post('/qa/questions/:question_id/answers', ((request, response) => {
  response.sendStatus(201);
}))

// Put request for question helpfulness
app.put('/qa/questions/:question_id/helpful', ((request, response) => {
  response.sendStatus(204);
}))

// Put request for question reporting
app.put('/qa/questions/:question_id/report', ((request, response) => {
  response.sendStatus(204);
}))

// Put request for answer helpfulness
app.put('/qa/answers/:answer_id/helpful', ((request, response) => {
  response.sendStatus(204);
}))

// Put request for answer reporting
app.put('/qa/answers/:answer_id/report', ((request, response) => {
  response.sendStatus(204);
}))


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
