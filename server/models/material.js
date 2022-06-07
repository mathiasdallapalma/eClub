const User = require('./user.js')
const mongoose = require('mongoose')

const MaterialSchema = new mongoose.Schema({
    description:{
        type: String,
        required: true,
        min: 3,
        max: 255,
    },
    player:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true,
    },
    given_at:{
        type: Date,
        default: Date.now,
    },
    returned_at:{
        type: Date,
    },
    added_by:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
})
module.exports = mongoose.model("Material", MaterialSchema)
