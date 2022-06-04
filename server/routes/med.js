const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const Med = require('../models/med');
const verify = require('./verifyToken');
const authorization = require('./authToken');


/* --- GET: all Meds --- */
router.get('/', verify, authorization, async(req, res) => {
    try{
        //loading all meds
        const med = await Med.find().populate("player",["name","surname"]);
        res.status(200).json(med);
    }catch(err){
        res.status(500).json({ message: err });
    }
})

/* --- GET: specific Med --- */
router.get('/:medId', verify, authorization, getMed, async (req, res) => {
    res.status(200).json(res.med)
})


/* --- GET: Med by player --- */
router.get('/player/:playerId', verify, authorization, async (req, res) => {
    
    let med
    try {
        med = await Med.find({player : req.params.playerId}).populate("player",["name","surname"]);
        if (med == null) {
            return res.status(404).json({ message: 'Cannot find player' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.status(200).json(med)
})

/* --- POST: creating one Med Certifcate --- */
router.post('/', verify, authorization, async (req, res) => {

    //create new Med
    const med = new Med({
        released_at: req.body.released_at,
        expiring_at: req.body.expiring_at,
        player: req.body.player,
        verified: req.body.verified
    })
    try{
        const savedMed = await med.save();
        res.status(201).json({ med: med._id })
    }catch(err){
        res.status(500).json({ message: err });
    }
} )

/* --- DELETE: specific Med --- */
router.delete('/:medId', verify, authorization, getMed, async (req, res) => {
    try {
        //removing med
        const removedMed = await res.med.remove()
        res.status(200).json({ message: 'Deleted  med certificate' })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
})

/* --- PATCH: update Med --- */
router.patch('/:medId', verify, authorization, async(req,res)=>{
    console.log(req.body);

    Med.findByIdAndUpdate({
        _id:req.params.medId
    },{
        $set:req.body
    }).then(()=>{
        res.status(200).send({message:"Success"});
    }).catch(err => {
       res.status(500).send(err.message);
    })
});

/* --- FUNCTION: get Med --- */
async function getMed(req, res, next) {
    let med
    try {
        med = await Med.findById(req.params.medId).populate("player",["name","surname"]);
        if (med == null) {
            return res.status(404).json({ message: 'Cannot find med certificate' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.med = med
    next()
  }

module.exports = router;
