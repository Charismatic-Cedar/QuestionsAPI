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
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  product_id INTEGER NOT NULL,
  body TEXT(1000) NOT NULL,
  date_written DATETIME DEFAULT CURRENT_TIMESTAMP,
  asker_name VARCHAR(60) NOT NULL,
  asker_email VARCHAR(40),
  reported BOOLEAN DEFAULT 0,
  helpful SMALLINT UNSIGNED DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(product_id),
);

CREATE TABLE answers (
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  question_id INT NOT NULL,
  body TEXT(1000) NOT NULL,
  date_written DATETIME DEFAULT CURRENT_TIMESTAMP,
  answerer_name VARCHAR(60) NOT NULL,
  answerer_email VARCHAR(40),
  reported BOOLEAN DEFAULT 0,
  helpfulness SMALLINT UNSIGNED DEFAULT 0,
  -- FOREIGN KEY (question_id) REFERENCES questions(id),
);

CREATE TABLE photos (
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  answer_id INT NOT NULL,
  photoURLS VARCHAR(300),
  FOREIGN KEY (answer_id) REFERENCES answers(id),
);

-- INSERT INTO questions () VALUES ();
-- INSERT INTO questions () VALUES ();
-- INSERT INTO questions () VALUES ();
