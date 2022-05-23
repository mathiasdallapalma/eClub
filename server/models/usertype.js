const mongoose = require('mongoose')
const UsTypeSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }, 
    type:{
        type: Number,
        required: true
    },
})

module.exports = mongoose.model("UserType", UsTypeSchema)


