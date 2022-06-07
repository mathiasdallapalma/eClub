const bcrypt = require('bcryptjs')
const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const User = require('../models/user.js')
const {loginValidation}= require('../validation')
const jwt = require('jsonwebtoken');


/* --- POST: login User --- */
router.post('/', async(req, res) => {
    //validation data before creating user 
    const {error} = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    
    //checking if the email exists
    const user = await User.findOne({email: req.body.email}).populate("a_type");
    if(!user) return res.status(400).send('Email or password is wrong');

    //password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password) //controlla hash 
    if(!validPass) return res.status(400).send('Email or password is wrong');

    //create and assign a token (TODO: durata token)
    const token = jwt.sign({ _id: user._id , a_type: user.a_type}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
 })

module.exports = router;
