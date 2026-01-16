const express = require('express');
const app = express();

let numberOfRequestForUser = {};

app.use((req, res, next) => {
  const user_id = req.headers.user_id;

  if (!user_id) {
    return res.status(400).json({ msg: "Input invalid" });
  }

  if (numberOfRequestForUser[user_id] === undefined) {
    numberOfRequestForUser[user_id] = 1;
    return next();
  }

  if (numberOfRequestForUser[user_id] > 5) {
    return res.status(429).json({ msg: "limit reached" });
  }

  numberOfRequestForUser[user_id]++;
  next();
});

setInterval(() => {
  numberOfRequestForUser = {};
}, 1000);

app.get('/user', (req, res) => {
  res.status(200).json({ name: "john" });
});

app.post('/user', (req, res) => {
  res.status(201).json({ msg: "created dummy user" });
});

app.listen(3000);
