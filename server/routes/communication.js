const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const Communication = require('../models/Communication')
const bcrypt = require('bcryptjs')
const {communicationValidation}= require('../validation')
const verify = require('./verifyToken');
const authorization = require('./authToken');


/* --- GET: all Communication --- */
router.get('/', verify, authorization, async(req, res) => {    
    
    try{
        //loading all communication
        const communication = await Communication.find().populate("teams", ["_id", "category"]).populate("added_by", ["_id", "name", "surname"]);
        res.status(200).json(communication);
    }catch(err){
        res.status(500).json({ message: err });
    }
})


/* --- GET: specific Communication --- */
router.get('/:communicationId', verify, authorization, getCommunication, async (req, res) => {
    res.status(200).json(res.communication)
})


/* --- POST: creating one Communication --- */
router.post('/', verify, authorization, async (req, res) => {

    //validation data before creating a new communication 
    const {error} = communicationValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //create new communication
    const communication = new Communication({
        teams: req.body.team,
        subject: req.body.subject,
        text: req.body.text,
        added_by: req.body.added_by
    })
    try{
        const savedCommunication = await communication.save();
        res.status(200).json({ communication: communication._id })
    }catch(err){
        res.status(500).json({ message: err });
    }
} )

/* --- DELETE: specific Communication --- */
router.delete('/:communicationId', verify, authorization, getCommunication, async (req, res) => {
    try {
        //removing user
        const removedCommunication = await res.communication.remove()
        res.status(200).json({ message: 'Deleted user' })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
})

/* --- PATCH: update Communication --- */
router.patch('/:communicationId', verify, authorization, async(req,res)=>{
    try {
        const communication = await Communication.findById({_id: req.params.communicationId})
        if(!payment){
            return res.status(404).json("Communication not found")
        }else{
            Communication.updateOne({_id: req.params.communicationId}, {$set:req.body}).exec()
            res.status(200).json({message: 'success'})
        }
    }catch(err){
        res.status(500).json({message: err.message})
    }
});

/* --- FUNCTION: get Communication --- */
async function getCommunication(req, res, next) {
    let communication
    try {
        communication = await Communication.findById(req.params.communicationId).populate("teams",["category"]).populate("added_by", ["_id", "name", "surname"]);
        if (communication == null) {
            return res.status(404).json({ message: 'Cannot find Communication' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.communication = communication
    next()
  }

module.exports = router;
