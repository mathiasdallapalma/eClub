const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const verify = require('./verifyToken');

const nodemailer = require('nodemailer');
const { createTestAccount } = require('nodemailer');

router.post('/', async (req, res) =>{

    //checking if email is valid
    //checking if email exist


    const {email} = req.body;
    let transporter = nodemailer.createTransport({
        host:"smtp.etheral.email",
        port: 5877,
        secure: false,
        auth:{
            user: createTestAccount.user,
            pass: createTestAccount.pass,
        },
    })

    let info = await nodemailer.sendMail({
       from: '"eClub - Gestionale Sportivo" <noreply@eclub.com>',
       to: user.maik,
       subject: "Hello", // Subject line
       text: "Hello world?", // plain text body
       html: "<b>Hello world?</b>", // html body
    });
})

console.log("Message sent: %s", info.messageId);

module.exports = router;
