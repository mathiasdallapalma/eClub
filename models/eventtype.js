const mongoose = require('mongoose')
const EvTypeSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }, 
    type:{
        type: Number,
        required: true
    },
})

module.exports = mongoose.model("EventType", EvTypeSchema)


