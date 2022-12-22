require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const moment = require('moment');
const app = express();
const db = require('./config/db');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// app.get('/', (req, res) => {
//     res.json({msg: 'Hello world!'});
// });

// app.get('/api', (req, res) => {
//     res.json({msg: 'Hello from the api!'});
// });

// Adding other routes
app.use('/api/user', require('./routes/user'));
app.use('/api/images', require('./routes/image'));

// Universal error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(process.env.HOST_PORT, () => {
    console.log(`Listening at https://${process.env.HOST_NAME}:${process.env.HOST_PORT}`);
});

module.exports = app;