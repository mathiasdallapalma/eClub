require('dotenv').config()
const mongoose = require('mongoose');
const app = require('./app');


/* --- DB Connection --- */
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true , useUnifiedTopology: true})
.then(() => {
    console.log("Connected to database")
    /* --- Server Starting --- */
    app.listen(3001, () => console.log("Server started"));
})
.catch((error) => console.error("Error connecting to database: ${error}"));


module.exports = app;


