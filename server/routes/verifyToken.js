const jwt = require('jsonwebtoken')
require('dotenv').config() 

module.exports = function auth(req, res, next){
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Invalid Token') //denied
    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified;
        next(); //ok
    }catch(err){
        res.status(401).send('Invalid Token / User is not admin'); //invalid
    }
} 