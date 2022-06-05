const mongoose = require('mongoose')
const MaterialSchema = new mongoose.Schema({
    description:{
        type: String,
        required: true,
        min: 3,
        max: 255,
    },
    player:{
         player:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true,
    },
    given_at:{
        type: Date,
    },
    returned_at:{
        type: Date,
    },
})
module.exports = mongoose.model("Material", MaterialSchema)
