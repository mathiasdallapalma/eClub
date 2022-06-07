const mongoose = require('mongoose')
const User = require('./user.js')
const TeamSchema = new mongoose.Schema({
    category:{
        type: String,
        required: true,
        min: 3,
        max: 255
    }, 
    status:{
        type: Number,
        default: '0'
    },
    hidden:{
        type: Number,
        default: '0'
    },
    added_by:{
        type: String,
        required: true
    },
    created_at:{
        type: Date,
        default: Date.now,
        required: true
    },
    deleted_at:{
        type: Date,
    },
    updated_at:{
        type: Date
    }
})

module.exports = mongoose.model("Team", TeamSchema)


