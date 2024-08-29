const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: 'YOUR_RDS_ENDPOINT',
  user: 'YOUR_DB_USER',
  password: 'YOUR_DB_PASSWORD',
  database: 'todo_db'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to the database.');
});

app.get('/', (req, res) => {
  res.send('Hello World! This is your To-Do app.');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});