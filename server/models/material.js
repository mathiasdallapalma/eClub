const mongoose = require('mongoose')
const MaterialSchema = new mongoose.Schema({
    description:{
        type: String,
        required: true,
        min: 3,
        max: 255,
    },
    player:{
        type: String, //TODO: da modificare
    },
    given_at:{
        type: Date,
    },
    returned_at:{
        type: Date,
    },
})
module.exports = mongoose.model("Material", MaterialSchema)
