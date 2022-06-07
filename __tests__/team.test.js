const app = require('../app');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const Team = require('../models/team.js');

require("dotenv").config();

/* --- Set Timeout --- */
jest.setTimeout(9000);

let teamTest //data testing
let WrongId = "629cd06cf9407f999c3b2632";
let WrongFormatId = "ciao";

/* --- Connection to Database --- */
beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await mongoose.connect(process.env.DATABASE_TEST_URL);

    teamTest = new Team({ 
        category:"Test",
        added_by:"62987f9e04224e2d33075e28" 

});
await teamTest.save();

})

/* --- Close Connection to Database--- */
afterAll( async () =>{
    
    await Team.deleteMany({})
    mongoose.connection.close(true);
})


describe('[SUPERTEST] [TEAM]  /api/v1/team', () => {

    var token = jwt.sign({email:"dd@eclub.com"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
    header={'Content-Type':'application/json', token:token};
    console.log(header)

    /* ---  GET TEAM --- */
    test('<200> GET all team', () => {
        return request(app).get('/api/v1/team')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    /* ---  GET SPECIFIC TEAM --- */

    test('<200> GET specific team', () => {
        return request(app).get('/api/v1/team/'+teamTest._id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> GET all team with not found id', () => {
        return request(app).get('/api/v1/team/'+WrongId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> GET all team with wrong id format', () => {
        return request(app).get('/api/v1/team/'+WrongFormatId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    /* --- POST TEAM--- */
    test('<200> POST new team', () => {
        return request(app).post('/api/v1/team/')
        .send({ 
                category:"Test2",
                added_by:"62987f9e04224e2d33075e28"
        })
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<400> POST new team with error in validation', () => {
        return request(app).post('/api/v1/team/')
        .send({})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    /* --- PATCH TEAM --- */
    test('<200> PATCH specific team', () => {
        return request(app).patch('/api/v1/team/'+teamTest._id+'/')
        .send({ 
            category:"Test3",
        })  
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> PATCH specific team with wrong id', () => {
        return request(app).patch('/api/v1/team/'+WrongId+'/')
        .send({ 
            amount:"10.9", 
            description:"prova",
            paid_at:"10/10/2020",
            player:"629ccffef9407f999c3b26e4"
        })  
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<400> PATCH specific team with validation error', () => {
        return request(app).patch('/api/v1/team/'+WrongFormatId+'/')
        .send({ 
            category:"Test3", 
        })  
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    /* --- DELETE TEAM--- */
    test('<200> DELETE specific team', () => {
        return request(app).delete('/api/v1/team/'+teamTest._id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> DELETE specific team with not found id', () => {
        return request(app).delete('/api/v1/team/'+WrongId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> DELETE specific team with wrong id format', () => {
        return request(app).delete('/api/v1/team/'+WrongFormatId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

   
})
