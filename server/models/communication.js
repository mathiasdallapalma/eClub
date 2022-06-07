const mongoose = require('mongoose')
const Team = require('./team.js')
const User = require('./user.js')


const CommunicationSchema = new mongoose.Schema({
    teams:[{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'Team',
        required: true
    }],
    subject:{
        type: String,
        required: true,
    },
    text:{
        type: String,
        required: true
    },
    added_by:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    created_at:{
        type: Date,
        default: Date.now,
        required: true
    },
})

module.exports = mongoose.model("Communication", CommunicationSchema)


