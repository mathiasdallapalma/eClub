const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const Material = require('../models/material');
const verify = require('./verifyToken');
const authorization = require('./authToken');

/* --- GET: all materials --- */
router.get('/', verify, authorization, async(req, res) => {
    try{
        //loading all materials
        const material = await Material.find().populate("player", ["_id", "name", "surname"]).populate("added_by", ["_id", "name", "surname"]);
        res.status(200).json(material);
    }catch(err){
        res.status(500).json({ message: err });
    }
})

/* --- GET: specific Material --- */
router.get('/:materialId', verify, authorization, getMaterial, async (req, res) => {
    res.status(200).json(res.material)
})


/* --- POST: creating one material --- */
router.post('/', verify, authorization, async (req, res) => {

    //create new material
    const material = new Material({
        description: req.body.description,
        player: req.body.player,
        given_at: req.body.given_at,
        returned_at: req.body.returned_at,
        added_by: req.body.added_by,
    })
    try{
        const savedMaterial = await material.save();
        res.status(201).json({ material: material._id })
    }catch(err){
        res.status(500).json({ message: err });
    }
} )

/* --- DELETE: specific Material --- */
router.delete('/:materialId', verify, authorization, getMaterial, async (req, res) => {
    try {
        //removing material
        const removedmaterial = await res.material.remove()
        res.status(200).json({ message: 'Deleted  material' })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
})

/* --- PATCH: update material --- */
router.patch('/:materialId', async(req,res)=>{
    console.log(req.body);

    Material.findByIdAndUpdate({
        _id:req.params.materialId
    },{
        $set:req.body
    }).then(()=>{
        res.status(200).json({message:"Success"});
    }).catch(err => {
       res.status(500).json(err.message);
    })
});

/* --- FUNCTION: get material --- */
async function getMaterial(req, res, next) {
    let material
    try {
        material = await Material.findById(req.params.materialId).populate("player", ["_id", "name", "surname"]).populate("added_by", ["_id", "name", "surname"]);
        if (material == null) {
            return res.status(404).json({ message: 'Cannot find material' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.material = material
    next()
  }

module.exports = router;
