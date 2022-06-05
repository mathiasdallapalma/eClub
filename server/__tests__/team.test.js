const app = require('../index.js');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const User = require('../models/User');
const Team = require('../models/Team');

require("dotenv").config();

/* --- Set Timeout --- */
jest.setTimeout(9000);

/* --- Connection to Database --- */
let BACKUP_USER
let BACKUP_TEAM

beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await mongoose.connect(process.env.DATABASE_URL);
    BACKUP_USER = await User.find({}).exec()
    BACKUP_TEAM = await Team.find({}).exec()
})

/* --- Close Connection to Database--- */
afterAll( async () =>{
    await User.deleteMany({})
    await Team.deleteMany({})
    await User.insertMany(BACKUP_USER)
    await Team.insertMany(BACKUP_TEAM)

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
    let id = "6298c3103818deda59b34104";

    test('<200> GET specific team', () => {
        return request(app).get('/api/v1/team/'+id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    let id1 = "6298c3103818deda59b34132";

    test('<404> GET all team with not found id', () => {
        return request(app).get('/api/v1/team/'+id1+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    let id2 = "ciao";

    test('<500> GET all team with wrong id format', () => {
        return request(app).get('/api/v1/team/'+id2+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    /* --- POST TEAM--- */
    test('<200> POST new team', () => {
        return request(app).post('/api/v1/team/')
        .send({ 
                category:"Test",
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
        return request(app).patch('/api/v1/team/'+id+'/')
        .send({ 
            category:"Test3",
        })  
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    let id10="6298c3103818deda59b34110"

    test('<404> PATCH specific team with wrong id', () => {
        return request(app).patch('/api/v1/team/'+id10+'/')
        .send({ 
            amount:"10.9", 
            description:"prova",
            paid_at:"10/10/2020",
            player:"629ccffef9407f999c3b26e4"
        })  
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<400> PATCH specific payment', () => {
        return request(app).patch('/api/v1/team/'+id+'/')
        .send({ 
            category:"Test3", 
        })  
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    let id11="ciao"

    /* --- DELETE TEAM--- */
    test('<200> DELETE specific team', () => {
        return request(app).delete('/api/v1/team/'+id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> DELETE specific team with not found id', () => {
        return request(app).delete('/api/v1/team/'+id10+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> DELETE specific payment with wrong id format', () => {
        return request(app).delete('/api/v1/team/'+id11+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

   
})
