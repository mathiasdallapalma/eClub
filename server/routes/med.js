const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const Med = require('../models/med');
const verify = require('./verifyToken');

/* --- GET: all Meds --- */
router.get('/', verify, async(req, res) => {
    try{
        //loading all meds
        const med = await Med.find();
        res.json(med);
    }catch(err){
        res.status(500).json({ message: err });
    }
})

/* --- GET: specific Med --- */
router.get('/:medId', verify, getMed, async (req, res) => {
    res.json(res.med)
})

/* --- POST: creating one Med Certifcate --- */
router.post('/', verify, async (req, res) => {

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
router.delete('/:medId', verify, getMed, async (req, res) => {
    try {
        //removing med
        const removedMed = await res.med.remove()
        res.status(200).json({ message: 'Deleted  med certificate' })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
})

/* --- PATCH: update Med --- */
router.patch('/:medId', async(req,res)=>{
    console.log(req.body);

    Med.findByIdAndUpdate({
        _id:req.params.medId
    },{
        $set:req.body
    }).then(()=>{
        res.sendStatus({message:"Success"});
    }).catch(err => {
       res.status(500).send(err.message);
    })
});

/* --- FUNCTION: get Med --- */
async function getMed(req, res, next) {
    let med
    try {
        med = await Med.findById(req.params.medId)
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
