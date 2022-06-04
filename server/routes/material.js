const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const Material = require('../models/material');
const verify = require('./verifyToken');

/* --- GET: all materials --- */
router.get('/', verify, async(req, res) => {
    try{
        //loading all materials
        const material = await Material.find();
        res.json(material);
    }catch(err){
        res.status(500).json({ message: err });
    }
})

/* --- GET: specific Material --- */
router.get('/:materialId', verify, getMaterial, async (req, res) => {
    res.json(res.material)
})


/* --- POST: creating one material --- */
router.post('/', verify, async (req, res) => {

    //create new material
    const material = new Material({
        description: req.body.description,
        player: req.body.player,
        given_at: req.body.given_at,
        returned_at: req.body.returned_at,
    })
    try{
        const savedMaterial = await material.save();
        res.status(201).json({ material: material._id })
    }catch(err){
        res.status(500).json({ message: err });
    }
} )

/* --- DELETE: specific Material --- */
router.delete('/:materialId', verify, getMaterial, async (req, res) => {
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
        res.sendStatus({message:"Success"});
    }).catch(err => {
       res.status(500).send(err.message);
    })
});

/* --- FUNCTION: get material --- */
async function getMaterial(req, res, next) {
    let material
    try {
        material = await Material.findById(req.params.materialId)
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
