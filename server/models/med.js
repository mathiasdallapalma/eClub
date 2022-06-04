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
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true,
    },
    doctor:{
        type: String, 
    },
    med_type:{
        type: String,
    },
    verified:{
        type: Boolean,
    },
    //TODO PDF
})
module.exports = mongoose.model("Med", MedSchema)
