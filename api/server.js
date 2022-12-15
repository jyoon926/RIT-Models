require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
    res.json({msg: 'Hello world!'});
});

app.get('/api/*', (req, res) => {
    res.json({msg: 'Hello from somewhere else!'});
});

app.listen(process.env.HOST_PORT, () => {
    console.log(`Listening at https://${process.env.HOST_NAME}:${process.env.HOST_PORT}`);
});