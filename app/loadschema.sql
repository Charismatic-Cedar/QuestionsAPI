SET GLOBAL local_infile = true;

-- LOAD DATA LOCAL INFILE 'data/clean/questions.csv'
LOAD DATA LOCAL INFILE '/tmp/questions.csv'
INTO TABLE questions
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n';

-- LOAD DATA LOCAL INFILE 'data/clean/answers.csv'
LOAD DATA LOCAL INFILE '/tmp/answers.csv'
INTO TABLE answers
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED by '"'
LINES TERMINATED BY '\n';


-- LOAD DATA LOCAL INFILE 'data/clean/answers_photos.csv' INTO TABLE photos
LOAD DATA LOCAL INFILE '/tmp/answers_photos.csv' INTO TABLE photos
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED by '"'
LINES TERMINATED BY '\n';
