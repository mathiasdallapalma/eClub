const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const Team = require('../models/Team')
const {teamValidation}= require('../validation')
const verify = require('./verifyToken');
const authorization = require('./authToken');


/* --- GET: all Team --- */
router.get('/', verify, authorization, async(req, res) => {
    try{
        //loading all teams
        const team = await Team.find({hidden: {$ne:1}});
        res.status(200).json(team);
    }catch(err){
        res.status(500).json({ message: err });
    }
})

/* --- GET: specific Team --- */
router.get('/:teamId', verify, authorization, getTeam, async (req, res) => {
    res.status(200).json(res.team)
})

/* --- POST: creating one Team --- */
router.post('/', verify, authorization, async (req, res) => {

    //validation data before creating Team 
    const {error} = teamValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //checking if the team is already in the database
    const categoryExist = await Team.findOne({category: req.body.category});
    if(categoryExist) return res.status(400).send('Category already exists')

    //create new team
    const team = new Team({
        category: req.body.category,
        added_by: req.body.added_by,
    })
    try{
        const savedTeam = await team.save();
        res.status(200).json({ team: team._id })
    }catch(err){
        res.status(500).json({ message: err });
    }
} )

/* --- DELETE: specific Team --- */
router.delete('/:teamId', verify, authorization, getTeam, async (req, res) => {
    try {
        //removing team
        const removedTeam = await res.team.remove()
        res.status(200).json({ message: 'Deleted team' })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
})

/* --- PATCH: update Team --- */
router.patch('/:teamId', verify, authorization, async(req,res)=>{
    
    //checking if the team is already in the database
    const categoryExist = await Team.findOne({category: req.body.category});
    if(categoryExist) return res.status(400).send('Category already exists')

    try {
        const team = await Team.findById({_id: req.params.teamId})
        if(!team){
            return res.status(404).json("team not found")
        }else{
            Team.updateOne({_id: req.params.teamId}, {$set:req.body}).exec()
            res.status(200).json({ message: 'success' })
        }
    }catch(err){
        res.status(500).json({ message: err.message })
    }
});

/* --- FUNCTION: get Team --- */
async function getTeam(req, res, next) {
    let team
    try {
        team = await Team.findById(req.params.teamId)
        if (team == null) {
            return res.status(404).json({ message: 'Cannot find team' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.team = team
    next()
  }

module.exports = router;
