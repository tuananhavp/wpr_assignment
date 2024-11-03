const mysql = require("mysql2");
require("dotenv").config();

// Create connection with database
const db = mysql
  .createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    multipleStatements: true,
  })
  .promise();

// Create the database and tables, and insert initial data
// const setupDatabase = `
//   CREATE DATABASE IF NOT EXISTS wpr2101040018;
//   USE wpr2101040018;

//   CREATE TABLE IF NOT EXISTS users (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(65) NOT NULL,
//     email VARCHAR(255) NOT NULL UNIQUE,
//     password VARCHAR(255) NOT NULL
//   );

//   CREATE TABLE IF NOT EXISTS emails (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     sender_id INT,
//     receiver_id INT,
//     subject VARCHAR(255),
//     body TEXT,
//     FOREIGN KEY (sender_id) REFERENCES users(id),
//     FOREIGN KEY (receiver_id) REFERENCES users(id)
//   );

//   INSERT INTO users (name, email, password) VALUES ('Tuan Anh', 'a@a.com', '123');
//   INSERT INTO users (name, email, password) VALUES ('Trung Anh', 'b@b.com', '123');
//   INSERT INTO users (name, email, password) VALUES ('Hai Anh', 'c@c.com', '123');

//   INSERT INTO emails (sender_id, receiver_id, subject, body) VALUES (1, 2, 'Subject 1', 'Body 1');
//   INSERT INTO emails (sender_id, receiver_id, subject, body) VALUES (1, 3, 'Subject 2', 'Body 2');
//   INSERT INTO emails (sender_id, receiver_id, subject, body) VALUES (2, 1, 'Subject 3', 'Body 3');
//   INSERT INTO emails (sender_id, receiver_id, subject, body) VALUES (3, 1, 'Subject 4', 'Body 4');
//   INSERT INTO emails (sender_id, receiver_id, subject, body) VALUES (2, 3, 'Subject 5', 'Body 5');
//   INSERT INTO emails (sender_id, receiver_id, subject, body) VALUES (3, 2, 'Subject 6', 'Body 6');
//   INSERT INTO emails (sender_id, receiver_id, subject, body) VALUES (2, 1, 'Subject 7', 'Body 7');
//   INSERT INTO emails (sender_id, receiver_id, subject, body) VALUES (3, 1, 'Subject 8', 'Body 8');
// `;

// db.query(setupDatabase, (err, results) => {
//   if (err) {
//     console.error("Error setting up database:", err);
//     return;
//   }
//   console.log("Database setup complete");
//   db.end();
// });

module.exports = db;
