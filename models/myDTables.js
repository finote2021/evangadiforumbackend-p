const user = `CREATE TABLE users(
    userid INT(20) NOT NULL AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL UNIQUE,
    firstname VARCHAR(20) NOT NULL,
    lastname VARCHAR(20) NOT NULL,
    email VARCHAR(40) NOT NULL,
    password VARCHAR(100) NOT NULL,
    PRIMARY KEY(userid, username)
);`;

const questions = `CREATE TABLE questions(
    id INT(20) NOT NULL AUTO_INCREMENT,
    question_id VARCHAR(100) NOT NULL UNIQUE,
    user_name VARCHAR(20) NOT NULL,
    created_at VARCHAR(20) NOT NULL,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(200) NOT NULL,
    PRIMARY KEY(id, question_id),
    FOREIGN KEY(user_name) REFERENCES users (username) 
);`;

const answers = `CREATE TABLE answers (
    answer_id INT(11) NOT NULL AUTO_INCREMENT,
    user_name VARCHAR(20) NOT NULL,
    question_id VARCHAR(100) NOT NULL,
    content VARCHAR(200) NOT NULL,
    created_at DATETIME NOT NULL,
    PRIMARY KEY(answer_id),
    FOREIGN KEY (question_id) REFERENCES questions(question_id),
    FOREIGN KEY (user_name) REFERENCES users(username)
);`;
