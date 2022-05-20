const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const {registerUserValidation}= require('../validation')
const verify = require('./verifyToken');

/* --- GET: all User --- */
router.get('/', verify, async(req, res) => {
    try{
        const user = await User.find();
        res.json(user);
    }catch(err){
        res.status(500).json({ message: err });
    }
})

/* --- GET: specific User --- */
router.get('/:userId', verify, getUser, async (req, res) => {
    res.json(res.user)
})

/* --- POST: creating one User --- */
router.post('/', verify, async (req, res) => {

    //validation data before creating user 
    const {error} = registerUserValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //checking if the user is already in the database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists')

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const user = new User({
        name: req.body.name,
        surname: req.body.name,
        email: req.body.email, 
        password: hashedPassword,
        a_type: req.body.a_type, 
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
        res.status(400).json({ message: err });
    }
} )

/* --- DELETE: specific User --- */
router.delete('/:userId', verify, getUser, async (req, res) => {
    try {
        const removedUser = await res.user.remove()
        res.status(200).json({ message: 'Deleted user' })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
})

/* --- UPDATE: specific User --- */
//TODO: da sistemare
router.patch('/:userId', verify, getUser, async (req, res) => {
    try{ 
        //validation data before updating user 
        const {error} = registerUserValidation(req.body)
        if(error) return res.status(400).send(error.details[0].message)
       
        //if there is a password --> hash
        if(req.body.password != null){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
        }

        //update specific field
        const updatedUser = await res.user.updateOne({_id: req.params.userId},
        { $set: { 
                name: req.body.name,
                surname: req.body.name,
                email: req.body.email, 
                password: hashedPassword,
                a_type: req.body.a_type, 
                zip: req.body.zip, 
                city: req.body.city, 
                province: req.body.province, 
                nation: req.body.nation, 
                street: req.body.street, 
                phone: req.body.phone,
                added_by: req.body.added_by,
                email: req.params.userId,
            }
        });
        res.json(updatedUser);
    }catch(err){
        res.status(400).json({ message: err });
    }
})

/* --- FUNCTION: get User --- */
async function getUser(req, res, next) {
    let user
    try {
        user = await User.findById(req.params.userId)
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
