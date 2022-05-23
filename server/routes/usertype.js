const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const UserType = require('../models/UserType')
const bcrypt = require('bcryptjs')
const {userTypeValidation}= require('../validation')
const verify = require('./verifyToken');

/* --- GET: all userType --- */
router.get('/', verify, async(req, res) => {
    try{
        //loading all userType
        const userType = await UserType.find();
        res.json(userType);
    }catch(err){
        res.status(500).json({ message: err });
    }
})
/* --- POST: creating one UserType --- */
router.post('/', verify, async (req, res) => {

    //validation data before creating UserType 
    const {error} = userTypeValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //checking if the user type is already in the database
    const userTypeExist = await UserType.findOne({type: req.body.type});
    if(userTypeExist) return res.status(400).send('User Type already exists')

    //create new user type
    const userType = new UserType({
        name: req.body.name,
        type: req.body.type
    })
    try{
        const savedUserType = await userType.save();
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

/* --- PATCH: update User --- */
router.patch('/:userTypeId', verify, async(req,res)=>{
    console.log(req.body);

    //checking if the userType is already in the database
    const typeExist = await UserType.findOne({type: req.body.type});
    if(typeExist) return res.status(400).send('Type already exists')

    UserType.findByIdAndUpdate({
        _id:req.params.userTypeId
    },{
        $set:req.body
    }).then(()=>{
        res.sendStatus({message:"Success"});
    }).catch(err => {
       res.status(500).send(err.message);
    })
});

/* --- FUNCTION: get Team --- */
async function getUserType(req, res, next) {
    let userType
    try {
        userType = await UserType.findById(req.params.userTypeId)
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
