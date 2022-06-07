const { date } = require('joi')
const mongoose = require('mongoose')
const User = require('./User')
const Team = require('./Team')
const EventType = require('./EventType')

const EventSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        min: 3,
        max: 255
    }, 
    date:{
        type:Date,
        required:true,   
    },
    teams:[{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'Team',
        required: true
    }], //nested array of teams reference ids
    description:{
        type: String,
        required: false,
        max: 255
    },
    e_type:{
        type: mongoose.Schema.Types.ObjectId, ref: 'EventType',
        required: false
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

module.exports = mongoose.model("Event", EventSchema)


