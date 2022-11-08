const express = require("express");
const cors = require("cors");
const app = express();
// require('dotenv').config();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('node server is running')
})

app.listen(port, () => {
    console.log(`node server running on port ${port}`);
})

module.exports = app;