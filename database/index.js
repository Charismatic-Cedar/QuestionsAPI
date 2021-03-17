const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

let questionsSchema = mongoose.Schema({
  product_id: {
    type: Number,
    required: true
  },
  question_id: {
    type: Number,
    required: true,
    unique: true
  },
  question_body: {
    type: String,
    required: true,
    maxLength: 1000
  },
  question_date: {
    type: Date,
    required: true
  },
  asker_name: {
    type: String,
    required: true,
    maxLength: 60
  },
  email: String,
  question_helpfulness: {
    type: Number,
    required: true
  },
  reported: {
    type: Boolean,
    required: true
  },
  answers: [answersSchema]
});

let answersSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  body: {
    type: String,
    required: true,
    maxLength: 1000
  },
  date: {
    type: Date,
    required: true
  },
  answerer_name: {
    type: String,
    required: true,
    maxLength: 60
  },
  email: String,
  helpfulness: {
    type: Number,
    required: true
  },
  question_id: {
    type: Number,
    required: true
  },
  photos: [photosSchema],
});

let photosSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  url: String,
})

let Questions = mongoose.model('Questions', questionsSchema);
let Answers = mongoose.model('Answers', answersSchema);
let Photos = mongoose.model('Photos', photosSchema);

let getQuestion = () => {
  return Questions.find()
}
let getAnswer = () => {
  return Answers.find()
}

let questions = new Questions;
questions.save('questionOne');
let answers = new Answers;
answers.save('answerOne');

module.exports = Questions;
module.exports = Answers;
module.exports = Photos;

