-- DROP DATABASE IF EXISTS questionsAnswers;

CREATE DATABASE questionsAnswers;

USE questionsAnswers;

CREATE TABLE questions (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
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
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  question_id INT NOT NULL,
  body TEXT(1000) NOT NULL,
  date_written DATETIME DEFAULT CURRENT_TIMESTAMP,
  answerer_name VARCHAR(60) NOT NULL,
  answerer_email VARCHAR(60) NOT NULL,
  reported BOOLEAN DEFAULT 0,
  helpfulness SMALLINT UNSIGNED DEFAULT 0,
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE INDEX question_id ON answers (question_id);

CREATE TABLE photos (
  id INT NOT NULL PRIMARY KEY,
  answer_id INT NOT NULL,
  photoURLS VARCHAR(300) NOT NULL
);

CREATE INDEX answer_id ON photos (answer_id);
