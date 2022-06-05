const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const mongoose = require('mongoose');
const Summoning = require('../models/Summoning')
const {summoningValidation}= require('../validation')
const verify = require('./verifyToken');
const authorization = require('./authToken');


/* --- GET: all Summoning --- */
router.get('/', verify, authorization, async(req, res) => {
    try{
        //loading all summonings
        const summoning = await Summoning.find().populate("player",["name","surname"]).populate("event",["title","date"]);
        res.json(summoning);
    }catch(err){
        res.status(500).json({ message: err });
    }
})

/* --- GET: specific Summoning --- */
/* IO la toglierei
router.get('/:summoningId', verify, authorization, getSummoning, async (req, res) => {
    res.json(res.summoning)
})
*/

/* --- GET: Summoning by event --- */
router.get('/event/:eventId', verify, authorization, getSummoningByEvent, async (req, res) => {
    res.json(res.summoning)
})

/* --- GET: Summoning by player --- */
router.get('/player/:playerId', verify, authorization, getSummoningByPlayer, async (req, res) => {
    res.json(res.summoning)
})

/* --- POST: creating one Summoning --- */
router.post('/', verify, authorization, async (req, res) => {

    //validation data before creating Summoning 
    const {error} = summoningValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //checking if the summoning is already in the database
    const summoningExist = await Summoning.findOne({event: req.body.event, player: req.body.player});
    if(summoningExist) return res.status(400).send('Attendace already exists')

    //create new summoning
    var player = mongoose.Types.ObjectId(req.body.player);
    var event = mongoose.Types.ObjectId(req.body.event);
    
    const summoning = new Summoning({
        event: event,
        player: player,
        value: req.body.value,
        added_by: req.body.added_by,
    })
    try{
        const savedSummoning = await summoning.save();
        res.status(201).json({ summoning: summoning._id })
    }catch(err){
        res.status(500).json({ message: err });
        console.log("asd");
    }
} )

/* --- DELETE: specific Summoning --- */
router.delete('/:summoningId', verify, authorization, getSummoning, async (req, res) => {
    try {
        //removing summoning
        const removedSummoning = await res.summoning.remove()
        res.status(200).json({ message: 'Deleted summoning' })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
})

/* --- PATCH: update Summoning --- */
router.patch('/:summoningId', async(req,res)=>{
    console.log(req.body);

    Summoning.findByIdAndUpdate({
        _id:req.params.summoningId
    },{
        $set:req.body
    }).then(()=>{
        res.sendStatus({message:"Success"});
    }).catch(err => {
       res.status(500).send(err.message);
    })
});

/* --- FUNCTION: get Summoning --- */
async function getSummoning(req, res, next) {
    let summoning
    try {
        summoning = await Summoning.findById(req.params.summoningId)
        if (summoning == null) {
            return res.status(404).json({ message: 'Cannot find summoning' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.summoning = summoning
    next()
  }

  /* --- FUNCTION: get Summoning by Event --- */
async function getSummoningByEvent(req, res, next) {
    let summoning
    try {
        summoning = await Summoning.find({player : req.params.eventId}).populate("player",["name","surname"]);
        if (summoning == null) {
            return res.status(404).json({ message: 'Cannot find summoning' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.summoning = summoning
    next()
  }
   /* --- FUNCTION: get Summoning by Player --- */
async function getSummoningByPlayer(req, res, next) {
    let summoning
    try {
        summoning = await Summoning.find({player : req.params.playerId}).populate("event",["title","date"]);
        if (summoning == null) {
            return res.status(404).json({ message: 'Cannot find summoning' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message})
    }
    res.summoning = summoning
    next()
  }

module.exports = router;
