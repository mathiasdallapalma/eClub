const mongoose = require('mongoose')
const PaymentSchema = new mongoose.Schema({
    amount:{
        type: Number,
        required: true,
    },
    description:{
        type: String,
    },
    paid_at:{
        type: Date,
        required: true,
        default: Date.now
    },
    player:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true,
    },
    //TODO PDF
})
module.exports = mongoose.model("Payment", PaymentSchema)
