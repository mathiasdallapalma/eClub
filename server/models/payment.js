const mongoose = require('mongoose')
const PaymentSchema = new mongoose.Schema({
    amount:{
        type: Number,
        required: true,
    },
    paid_at:{
        type: Date,
        required: true,
        default: Date.now
    },
    player:{
        type: String, //TODO: da modificare
        required: true,
    },
    //TODO PDF
})
module.exports = mongoose.model("Payment", PaymentSchema)
