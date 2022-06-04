const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const mongoose = require('mongoose');
const Attendance = require('../models/Attendance')
const {attendanceValidation}= require('../validation')
const verify = require('./verifyToken');

/* --- GET: all Attends --- */
router.get('/', verify, async(req, res) => {
    try{
        //loading all attendances
        const attendance = await Attendance.find().populate("player",["name","surname"]).populate("event",["title","date"]);
        res.json(attendance);
    }catch(err){
        res.status(500).json({ message: err });
    }
})

/* --- GET: specific Attendance --- */
/* IO la toglierei
router.get('/:attendanceId', verify, getAttendance, async (req, res) => {
    res.json(res.attendance)
})
*/

/* --- GET: Attendance by event --- */
router.get('/event/:eventId', verify, getAttendanceByEvent, async (req, res) => {
    res.json(res.attendance)
})

/* --- GET: Attendance by player --- */
router.get('/player/:playerId', verify, getAttendanceByPlayer, async (req, res) => {
    res.json(res.attendance)
})

/* --- POST: creating one Attendance --- */
router.post('/', verify, async (req, res) => {

    //validation data before creating Attendance 
    const {error} = attendanceValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //checking if the attendance is already in the database
    const attendanceExist = await Attendance.findOne({event: req.body.event, player: req.body.player});
    if(attendanceExist) return res.status(400).send('Attendace already exists')

    //create new attendance
    var player = mongoose.Types.ObjectId(req.body.player);
    var event = mongoose.Types.ObjectId(req.body.event);
    
    const attendance = new Attendance({
        event: event,
        player: player,
        value: req.body.value,
        added_by: req.body.added_by,
    })
    try{
        const savedAttendance = await attendance.save();
        res.status(201).json({ attendance: attendance._id })
    }catch(err){
        res.status(500).json({ message: err });
        console.log("asd");
    }
} )

/* --- DELETE: specific Attendance --- */
router.delete('/:attendanceId', verify, getAttendance, async (req, res) => {
    try {
        //removing attendance
        const removedAttendance = await res.attendance.remove()
        res.status(200).json({ message: 'Deleted attendance' })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
})

/* --- PATCH: update Attendance --- */
router.patch('/:attendanceId', async(req,res)=>{
    console.log(req.body);

    Attendance.findByIdAndUpdate({
        _id:req.params.attendanceId
    },{
        $set:req.body
    }).then(()=>{
        res.sendStatus({message:"Success"});
    }).catch(err => {
       res.status(500).send(err.message);
    })
});

/* --- FUNCTION: get Attendance --- */
async function getAttendance(req, res, next) {
    let attendance
    try {
        attendance = await Attendance.findById(req.params.attendanceId);
        if (attendance == null) {
            return res.status(404).json({ message: 'Cannot find attendance' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.attendance = attendance
    next()
  }

  /* --- FUNCTION: get Attendance by Event --- */
async function getAttendanceByEvent(req, res, next) {
    let attendance
    try {
        attendance = await Attendance.find({player : req.params.eventId}).populate("player",["name","surname"]);
        if (attendance == null) {
            return res.status(404).json({ message: 'Cannot find attendance' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.attendance = attendance
    next()
  }
   /* --- FUNCTION: get Attendance by Player --- */
async function getAttendanceByPlayer(req, res, next) {
    let attendance
    try {
        attendance = await Attendance.find({player : req.params.playerId}).populate("event",["title","date"]);
        if (attendance == null) {
            return res.status(404).json({ message: 'Cannot find attendance' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.attendance = attendance
    next()
  }

module.exports = router;
