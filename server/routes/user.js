const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const {registerUserValidation}= require('../validation')
const verify = require('./verifyToken');
const authorization = require('./authToken');


/* --- GET: all User --- */
router.get('/', verify, authorization, async(req, res) => {    
    
    try{
        //loading all users
        const user = await User.find().populate("a_type", ["_id", "name","type"]).populate("added_by", ["_id", "name", "surname"])
        res.json(user);
    }catch(err){
        res.status(500).json({ message: err });
    }
})


/* --- GET: specific User --- */
router.get('/:userId', verify, authorization, getUser, async (req, res) => {
    res.json(res.user)
})


/* --- POST: creating one User --- */
router.post('/', verify, authorization, async (req, res) => {

    //validation data before creating user 
    const {error} = registerUserValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //checking if the user is already in the database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists')

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email, 
        password: hashedPassword,
        birth: req.body.birth,
        a_type: req.body.a_type, 
        id_team: req.body.id_team,
        zip: req.body.zip, 
        city: req.body.city, 
        province: req.body.province, 
        nation: req.body.nation, 
        street: req.body.street, 
        phone: req.body.phone,
        added_by: req.body.added_by,
    })
    try{
        const savedUser = await user.save();
        res.status(201).json({ user: user._id })
    }catch(err){
        res.status(500).json({ message: err });
    }
} )

/* --- DELETE: specific User --- */
router.delete('/:userId', verify, authorization, getUser, async (req, res) => {
    try {
        //removing user
        const removedUser = await res.user.remove()
        res.status(200).json({ message: 'Deleted user' })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
})

/* --- PATCH: update User --- */
router.patch('/:userId', verify, authorization, async(req,res)=>{
    console.log(req.body);

    //hashing password
    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    //checking if the user is already in the database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists')

    User.findByIdAndUpdate({
        _id:req.params.userId
    },{
        $set:req.body
    }).then(()=>{
        res.status(201).json({message:"Success"});
    }).catch(err => {
       res.status(500).send(err.message);
    })
});

/* --- FUNCTION: get User --- */
async function getUser(req, res, next) {
    let user
    try {
        user = await User.findById(req.params.userId).populate("a_type", ["_id", "name"]).populate("added_by", ["_id", "name", "surname"])
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.user = user
    next()
  }

module.exports = router;
