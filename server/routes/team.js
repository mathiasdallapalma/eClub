const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const Team = require('../models/Team')
const {teamValidation}= require('../validation')
const verify = require('./verifyToken');

/* --- GET: all Team --- */
router.get('/', verify, async(req, res) => {
    try{
        //loading all teams
        const team = await Team.find();
        res.json(team);
    }catch(err){
        res.status(500).json({ message: err });
    }
})

/* --- GET: specific Team --- */
router.get('/:teamId', verify, getTeam, async (req, res) => {
    res.json(res.team)
})

/* --- POST: creating one Team --- */
router.post('/', verify, async (req, res) => {

    //validation data before creating Team 
    const {error} = teamValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //checking if the team is already in the database
    const categoryExist = await Team.findOne({category: req.body.category});
    if(categoryExist) return res.status(400).send('Category already exists')

    //create new team
    const team = new Team({
        name: req.body.name,
        category: req.body.category,
        players: req.body.players, //importante formato pl1, pl2, pl3, pl4
        coach: req.body.coach,
        tm: req.body.tm,
        added_by: req.body.added_by,
    })
    try{
        const savedTeam = await team.save();
        res.status(201).json({ team: team._id })
    }catch(err){
        res.status(500).json({ message: err });
    }
} )

/* --- DELETE: specific Team --- */
router.delete('/:teamId', verify, getTeam, async (req, res) => {
    try {
        //removing team
        const removedTeam = await res.team.remove()
        res.status(200).json({ message: 'Deleted team' })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
})

/* --- PATCH: update Team --- */
router.patch('/:teamId', async(req,res)=>{
    console.log(req.body);

    //checking if the team is already in the database
    const categoryExist = await Team.findOne({category: req.body.category});
    if(categoryExist) return res.status(400).send('Category already exists')

    Team.findByIdAndUpdate({
        _id:req.params.teamId
    },{
        $set:req.body
    }).then(()=>{
        res.sendStatus({message:"Success"});
    }).catch(err => {
       res.status(500).send(err.message);
    })
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
