DROP DATABASE IF EXISTS questionsAnswers;

CREATE DATABASE questionsAnswers;

USE questionsAnswers;

-- These might be passed in:
-- product id
-- count (primary key)
-- page

-- Suggestions from Rob:
  -- Default helpfulness to 0
  -- Can default - can check to see if email is a valid email
  -- Adding valuidation
  -- Can add a check if email is a valid email


CREATE TABLE products (
  product_id INTEGER NOT NULL PRIMARY KEY,
)

CREATE TABLE questions (
  question_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  product_id INTEGER NOT NULL,
  question_body TEXT(1000) NOT NULL,
  question_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  asker_name VARCHAR(60) NOT NULL,
  email VARCHAR(40),
  question_helpfulness SMALLINT UNSIGNED DEFAULT 0,
  reported BOOLEAN DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(product_id),
);

CREATE TABLE answers (
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  body TEXT(1000) NOT NULL,
  email VARCHAR(40),
  answer_date DATETIME NOT NULL,
  answer_name VARCHAR(60) NOT NULL,
  helpfulness SMALLINT UNSIGNED DEFAULT 0,
  reported BOOLEAN DEFAULT 0,
  question_id INT NOT NULL,
  FOREIGN KEY (question_id) REFERENCES questions(question_id),
);

CREATE TABLE photos (
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  photosURL VARCHAR(250),
  answer_id INT NOT NULL,
  FOREIGN KEY (answer_id) REFERENCES answers(id),
);

-- INSERT INTO questions () VALUES ();
-- INSERT INTO questions () VALUES ();
-- INSERT INTO questions () VALUES ();
