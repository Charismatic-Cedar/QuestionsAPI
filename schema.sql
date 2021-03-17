DROP DATABASE IF EXISTS questionsAnswers;

CREATE DATABASE questionsAnswers;

USE questionsAnswers;

CREATE TABLE questions (
  question_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  question_body TEXT(1000) NOT NULL,
  question_date DATETIME NOT NULL,
  asker_name VARCHAR(60) NOT NULL,
  question_helpfulness SMALLINT UNSIGNED NOT NULL,
  reported BOOL
);

CREATE TABLE answers (
  answer_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  body TEXT(1000),
  answer_date DATETIME NOT NULL,
  answer_name VARCHAR(60),
  helpfulness SMALLINT UNSIGNED NOT NULL,
  FOREIGN KEY (question_id) REFERENCES questions(question_id)
);

CREATE TABLE photos (
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  photosURL VARCHAR(250),
  answer_id INT NOT NULL,
  FOREIGN KEY (answer_id) REFERENCES answers(answer_id)
);


-- INSERT INTO questions () VALUES ();
-- INSERT INTO questions () VALUES ();
-- INSERT INTO questions () VALUES ();