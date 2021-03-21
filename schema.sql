DROP DATABASE IF EXISTS questionsAnswers;

CREATE DATABASE questionsAnswers;

USE questionsAnswers;

CREATE TABLE questions (
  question_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  body TEXT(1000) NOT NULL,
  date_written DATETIME DEFAULT CURRENT_TIMESTAMP,
  asker_name VARCHAR(60) NOT NULL,
  asker_email VARCHAR(60) NOT NULL,
  reported BOOLEAN DEFAULT 0,
  helpful SMALLINT UNSIGNED DEFAULT 0
);

CREATE INDEX product_id ON questions (product_id);

CREATE TABLE answers (
  answer_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  question_id INT NOT NULL,
  answerBody TEXT(1000) NOT NULL,
  answerDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  answerer_name VARCHAR(60) NOT NULL,
  answerer_email VARCHAR(60) NOT NULL,
  reportedAnswer BOOLEAN DEFAULT 0,
  helpfulness SMALLINT UNSIGNED DEFAULT 0,
  FOREIGN KEY (question_id) REFERENCES questions(question_id)
);

CREATE INDEX question_id ON answers (question_id);

CREATE TABLE photos (
  photo_id INT NOT NULL PRIMARY KEY,
  a_id INT NOT NULL,
  photoURLS VARCHAR(300) NOT NULL
);

CREATE INDEX a_id ON photos (a_id);

ALTER TABLE photos RENAME COLUMN answer_id TO a_id;