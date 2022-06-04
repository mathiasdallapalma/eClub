const mongoose = require('mongoose')
const MedSchema = new mongoose.Schema({
    released_at:{
        type: Date,
        required: true,
    },
    expiring_at:{
        type: Date,
        required: true,
    },
    player:{
        type: String, //TODO: da modificare
        required: true,
    },
    verified:{
        type: Boolean,
        default: false,
    },
    //TODO PDF
})
module.exports = mongoose.model("Med", MedSchema)
