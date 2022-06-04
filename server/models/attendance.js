const mongoose = require('mongoose')
const User = require('./User')
const AttendanceSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, //nested array of users reference ids
    value:{
        type: Boolean,
        required: true
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

module.exports = mongoose.model("Attendance", AttendanceSchema)


