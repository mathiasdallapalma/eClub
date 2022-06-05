const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const mongoose = require('mongoose');
const Evaluation = require('../models/Evaluation')
const {evaluationValidation}= require('../validation')
const \ = require('./verifyToken');
const authorization = require('./authToken');

/* --- GET: all Attends --- */
router.get('/', verify, authorization, async(req, res) => {
    try{
        //loading all evaluations
        const evaluation = await Evaluation.find().populate("player",["name","surname"]).populate("event",["title","date"]);;
        res.json(evaluation);
    }catch(err){
        res.status(500).json({ message: err });
    }
})

/* --- GET: specific Evaluation --- */
/* IO la toglierei
router.get('/:evaluationId', verify, authorization, getEvaluation, async (req, res) => {
    res.json(res.evaluation)
})
*/

/* --- GET: Evaluation by event --- */
router.get('/event/:eventId', verify, authorization, getEvaluationByEvent, async (req, res) => {
    res.json(res.evaluation)
})

/* --- GET: Evaluation by player --- */
router.get('/player/:playerId', verify, authorization, getEvaluationByPlayer, async (req, res) => {
    res.json(res.evaluation)
})

/* --- POST: creating one Evaluation --- */
router.post('/', verify, authorization, async (req, res) => {

    //validation data before creating Evaluation 
    const {error} = evaluationValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //checking if the evaluation is already in the database
    const evaluationExist = await Evaluation.findOne({event: req.body.event, player: req.body.player});
    if(evaluationExist) return res.status(400).send('Attendace already exists')

    //create new evaluation
    var player = mongoose.Types.ObjectId(req.body.player);
    var event = mongoose.Types.ObjectId(req.body.event);
    
    const evaluation = new Evaluation({
        event: event,
        player: player,
        value: req.body.value,
        added_by: req.body.added_by,
    })
    try{
        const savedEvaluation = await evaluation.save();
        res.status(201).json({ evaluation: evaluation._id })
    }catch(err){
        res.status(500).json({ message: err });
        console.log("asd");
    }
} )

/* --- DELETE: specific Evaluation --- */
router.delete('/:evaluationId', verify, authorization, getEvaluation, async (req, res) => {
    try {
        //removing evaluation
        const removedEvaluation = await res.evaluation.remove()
        res.status(200).json({ message: 'Deleted evaluation' })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
})

/* --- PATCH: update Evaluation --- */
router.patch('/:evaluationId', async(req,res)=>{
    console.log(req.body);

    Evaluation.findByIdAndUpdate({
        _id:req.params.evaluationId
    },{
        $set:req.body
    }).then(()=>{
        res.sendStatus({message:"Success"});
    }).catch(err => {
       res.status(500).send(err.message);
    })
});

/* --- FUNCTION: get Evaluation --- */
async function getEvaluation(req, res, next) {
    let evaluation
    try {
        evaluation = await Evaluation.findById(req.params.evaluationId)
        if (evaluation == null) {
            return res.status(404).json({ message: 'Cannot find evaluation' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.evaluation = evaluation
    next()
  }

  /* --- FUNCTION: get Evaluation by Event --- */
async function getEvaluationByEvent(req, res, next) {
    let evaluation
    try {
        evaluation = await Evaluation.find({player : req.params.eventId}).populate("player",["name","surname"]);
        if (evaluation == null) {
            return res.status(404).json({ message: 'Cannot find evaluation' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.evaluation = evaluation
    next()
  }
   /* --- FUNCTION: get Evaluation by Player --- */
async function getEvaluationByPlayer(req, res, next) {
    let evaluation
    try {
        evaluation = await Evaluation.find({player : req.params.playerId}).populate("event",["title","date"]);
        if (evaluation == null) {
            return res.status(404).json({ message: 'Cannot find evaluation' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.evaluation = evaluation
    next()
  }

module.exports = router;
