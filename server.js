const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const auth = require('./routers/auth');

const app = express();
const APP_PORT = process.env.APP_PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the API"
    });
})

app.use('/api/users/', auth);

app.listen(APP_PORT, () => {
  console.log(`Server listening on port ${APP_PORT}`);
})
