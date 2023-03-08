require('dotenv').config()

const express = require('express');
const app = express();
app.use(express.json());
const port = process.env.PORT;

const profiles = require('./routes/profiles');
const matches = require('./routes/matches');

app.get('/', (req, res) => {
    res.send('Hello world!')
})

app.use('/profiles', profiles);
app.use('/matches', matches);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})