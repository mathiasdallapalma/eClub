const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const EventType = require('../models/EventType')
const bcrypt = require('bcryptjs')
const {eventTypeValidation}= require('../validation')
const verify = require('./verifyToken');
const authorization = require('./authToken');

/* --- GET: all eventType --- */
router.get('/', verify, authorization, async(req, res) => {
    try{
        //loading all eventType
        const eventType = await EventType.find();
        res.json(eventType);
    }catch(err){
        res.status(500).json({ message: err });
    }
})
/* --- POST: creating one EventType --- */
router.post('/', verify, authorization, async (req, res) => {

    //validation data before creating EventType 
    const {error} = eventTypeValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //checking if the event type is already in the database
    const eventTypeExist = await EventType.findOne({type: req.body.type});
    if(eventTypeExist) return res.status(400).send('Event Type already exists')

    //create new event type
    const eventType = new EventType({
        name: req.body.name,
        type: req.body.type,
        added_by: req.body.added_by
    })
    try{
        const savedEventType = await eventType.save();
        res.status(200).json({ eventType: eventType._id })
    }catch(err){
        res.status(400).json({ message: err });
    }
} )

/* --- DELETE: specific EventType --- */
router.delete('/:eventTypeId', verify, authorization, getEventType, async (req, res) => {
    try {
        const removedEventType = await res.eventType.remove()
        res.status(200).json({ message: 'Deleted event type' })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
})

/* --- PATCH: update Event --- */
router.patch('/:eventTypeId', verify, authorization, async(req,res)=>{
    try {
        const eventType = await EventType.findById({_id: req.params.eventTypeId})
        if(!eventType){
            return res.status(404).json("eventType not found")
        }else{
            EventType.updateOne({_id: req.params.eventTypeId}, {$set:req.body}).exec()
            res.status(200).json({ message: 'success' })
        }
    }catch(err){
        res.status(500).json({ message: err.message })
    }
});

/* --- FUNCTION: get EventType --- */
async function getEventType(req, res, next) {
    let eventType
    try {
        eventType = await EventType.findById(req.params.eventTypeId)
        if (eventType == null) {
            return res.status(404).json({ message: 'Cannot find eventType' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.eventType = eventType
    next()
  }



module.exports = router;
