DROP DATABASE IF EXISTS questionsAnswers;

CREATE DATABASE questionsAnswers;

USE questionsAnswers;

-- This might be shared:
-- product id
-- count (primary key)
-- page

CREATE TABLE questions (
  question_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  product_id INTEGER NOT NULL,
  question_body TEXT(1000) NOT NULL,
  question_date DATETIME NOT NULL,
  asker_name VARCHAR(60) NOT NULL,
  email VARCHAR(40),
  question_helpfulness SMALLINT UNSIGNED NOT NULL,
  reported BOOL,
);

CREATE TABLE answers (
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  body TEXT(1000) NOT NULL,
  email VARCHAR(40),
  answer_date DATETIME NOT NULL,
  answer_name VARCHAR(60) NOT NULL,
  helpfulness SMALLINT UNSIGNED NOT NULL,
  reported BOOL,
  question_id INT NOT NULL,
  FOREIGN KEY (question_id) REFERENCES questions(question_id),
);

CREATE TABLE photos (
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  photosURL VARCHAR(250),
  thumbnailURL VARCHAR(250),
  question_id INT NOT NULL,
  answer_id INT NOT NULL,
  FOREIGN KEY (question_id) REFERENCES questions(product_id),
  FOREIGN KEY (answer_id) REFERENCES answers(id),
  FOREIGN KEY (product_id) REFERENCES questions(product_id)
);


-- INSERT INTO questions () VALUES ();
-- INSERT INTO questions () VALUES ();
-- INSERT INTO questions () VALUES ();