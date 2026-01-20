const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json())

mongoose.connect("mongodb+srv://zaidbadgujar:halamadrid@cluster0.utvbocc.mongodb.net/course_app")