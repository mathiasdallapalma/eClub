require('dotenv').config()

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

/* --- Middlewares: Body Parser --- */
app.use(bodyParser.json());

/* --- Routes --- */
const authRoute = require('./routes/auth');
const userRoute = require('./routes/User');
const userTypeRoute = require('./routes/UserType');
const teamRoute = require('./routes/Team');

app.use("/user", userRoute)
app.use("/userType", userTypeRoute)
app.use("/team", teamRoute)
app.use("/login", authRoute)


/* --- DB Connection --- */
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

/* --- Server Starting --- */
app.listen(3000, () => console.log("Server started"));


