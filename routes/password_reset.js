const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const verify = require('./verifyToken');
const jwt = require('jsonwebtoken');
const {passwordResetValidation}= require('../validation')

const nodemailer = require('nodemailer');
const { createTestAccount } = require('nodemailer');
const website="http://localhost:3000"


/* --- POST: creating reset password --- */
router.post('/', getUser, async (req, res) =>{

    //validation data before sending email 
    const {error} = passwordResetValidation(req.body)

    if(error) return res.status(400).send(error.details[0].message)
    //token generation, expire in 15 minutes
    const token = jwt.sign({ _id: res.user._id }, 'reset-token', {expiresIn: '15m'});

    //generate url
    let url = `${website}/password_reset?t=${token}`;

    //test account
    const testAccount = await nodemailer.createTestAccount();
    
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });

    //send mail with defined transport object
    let mailOptions = {
        from: '"eClub" <noreply@eclub.com>', //sender address
        to: "estell.bernhard15@ethereal.email", //res.user.email, //list of receivers
        subject: "Recupero Credenziali", // Subject line
        html: `<b>Ciao! accedi a <a href=${url}>questo link</a> per reimpostare la tua password</b>`, //html body
    };
    console.info(mailOptions);
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.status(401).send('Error sending email');
        } else {
          console.log('Email sent: ' + info.response);
          console.log(`token: ${token}`);
          res.status(201).send('Succesfully notified user');
        }
      });   
});

/* --- PUT: reset password user --- */
router.put('/', verify, async (req, res) => {

    let user = await User.findById(req.user._id);
  
    if(!user) {
      return res.status(401).send('No user found with such id');
    }
  
    user.password_hash = crypto.createHash('sha256').update(req.body['password'].concat(user.salt)).digest('hex');
    user.save()
      .then(() => res.status(201).send('Successfully changes user password'))
      .catch(() => res.status(500).send('Error updating user password'));
  
  })


/* --- FUNCTION: get User --- */
async function getUser(req, res, next) {
    let user
    try {

        user = await User.findOne({email: req.body.email})
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
