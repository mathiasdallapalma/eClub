const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 3001;

/* --- DB Connection --- */
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true , useUnifiedTopology: true})
.then(() => {
    console.log("Connected to database")
    /* --- Server Starting --- */
    app.listen(port, () => console.log("Server started"));
})
.catch((error) => console.error("Error connecting to database: ${error}"));


module.exports = app;