const express = require('express');
const req = require('express/lib/request');
const UserType = require('../models/UserType');
const router = express.Router();
const User = require('../models/UserType')
const {teamValidation}= require('../validation')
const verify = require('./verifyToken');


/* --- GET: all userType --- */
router.get('/', verify, async(req, res) => {
    try{
        const userType = await UserType.find();
        res.json(userType);
    }catch(err){
        res.status(500).json({ message: err });
    }
})

/* --- GET: specific UserType --- */
router.get('/:userTypeId', verify, getUserType, async (req, res) => {
    res.json(res.userType)
})

/* --- POST: creating one UserType --- */
router.post('/', verify, async (req, res) => {

    //validation data before creating UserType 
    const {error} = userTypeValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //checking if the user type is already in the database
    const userTypeExist = await User.findOne({type: req.body.type});
    if(userTypeExist) return res.status(400).send('User Type already exists')

    //create new user type
    const userType = new UserType({
        name: req.body.name,
        type: req.body.type
    })
    try{
        const savedUserType = await team.save();
        res.status(201).json({ userType: userType._id })
    }catch(err){
        res.status(400).json({ message: err });
    }
} )

/* --- DELETE: specific UserType --- */
router.delete('/:userTypeId', verify, getUserType, async (req, res) => {
    try {
        const removedUserType = await res.userType.remove()
        res.status(200).json({ message: 'Deleted user type' })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
})

/* --- UPDATE: specific Team --- */
router.patch('/:userTypeId', verify, getUserType, async (req, res) => {
    try{ 
        const updatedUserType = await res.userType.updateOne();
        res.json(updatedUserType);
    }catch(err){
        res.status(400).json({ message: err });
    }
})

/* --- FUNCTION: get Team --- */
async function getUserType(req, res, next) {
    let userType
    try {
        userType = await Team.findById(req.params.userTypeId)
        if (userType == null) {
            return res.status(404).json({ message: 'Cannot find userType' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.userType = userType
    next()
  }



module.exports = router;
