const express = require('express');
const cors = require('cors');
const app = express();
const helmet = require('helmet');
const bodyParser = require('body-parser');
const port = 3000;
const dotenv = require('dotenv').config();

app.use(helmet());
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.listen(port, function (err, success) {
    if (err) {
        console.log("error in initialising the node server");
    } else {
        console.log("server started on port " + port)
    }
});

const mainRoutes = require('./routes/main_routes.js');
app.use('/api', mainRoutes);
