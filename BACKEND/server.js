const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
const authRouter = require('./routes/authRouter');
const contactRouter = require('./routes/contactRouter');


connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);

app.use('/api/contacts', contactRouter);

app.use('/', (req, res, next) => {
  res.send('Hello World!');
  console.log("Hello World");
});

app.listen((PORT), () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});



//aman2007kumar2007_db_user
//8c9eYD972QXkSLfi