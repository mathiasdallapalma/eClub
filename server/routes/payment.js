const express = require('express');
const req = require('express/lib/request');
const Joi = require('joi');
const payment = require('../models/Payment');
const router = express.Router();
const Payment = require('../models/Payment');
const verify = require('./verifyToken');

/* --- GET: all Payments --- */
router.get('/', verify, async(req, res) => {
    try{
        //loading all payments
        const payment = await Payment.find().populate("player", ["_id", "name", "surname"])
        res.json(payment);
    }catch(err){
        res.status(500).json({ message: err });
    }
})

/* --- GET: specific Payment --- */
router.get('/:paymentId', verify, getPayment, async (req, res) => {
    res.json(res.payment)
})

/* --- POST: creating one Payment --- */
router.post('/', verify, async (req, res) => {

    //create new Payment
    const payment = new Payment({
        amount: req.body.amount,
        paid_at: req.body.paid_at,
        player: req.body.player,
    })
    try{
        const savedMed = await payment.save();
        res.status(201).json({ payment: payment._id })
    }catch(err){
        res.status(500).json({ message: err });
    }
})

/* --- DELETE: specific Payment --- */
router.delete('/:paymentId', verify, getPayment, async (req, res) => {
    try {
        //removing payment
        const removedpayment = await res.payment.remove()
        res.status(200).json({ message: 'Deleted  payment' })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
})

/* --- PATCH: update Payment --- */
router.patch('/:paymentId', verify, async(req,res)=>{
    Payment.findByIdAndUpdate({
        _id:req.params.paymentId
    },{
        $set:req.body
    }).then(()=>{
        res.status(201).json({message:"Success"});
    }).catch(err => {
        res.status(500).send(err.message);
    })
});

/* --- FUNCTION: get Payment --- */
async function getPayment(req, res, next) {
    let payment
    try {
        payment = await Payment.findById(req.params.paymentId).populate("player", ["_id", "name", "surname"])
        if (payment == null) {
            return res.status(404).json({ message: 'Cannot find payment' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.payment = payment
    next()
  }

module.exports = router;
