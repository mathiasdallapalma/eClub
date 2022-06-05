const app = require('../index.js');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const User = require('../models/User');
const Team = require('../models/Team');
const UserType = require('../models/UserType');

require("dotenv").config();

/* --- Set Timeout --- */
jest.setTimeout(9000);

/* --- Connection to Database --- */
let BACKUP_USER
let BACKUP_TEAM
let BACKUP_USERTYPE


beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await mongoose.connect(process.env.DATABASE_URL);
    BACKUP_USER = await User.find({}).exec()
    BACKUP_TEAM = await Team.find({}).exec()
    BACKUP_USERTYPE = await UserType.find({}).exec()
})

/* --- Close Connection to Database--- */
afterAll( async () =>{
    await User.deleteMany({})
    await Team.deleteMany({})
    await UserType.deleteMany({})
    await User.insertMany(BACKUP_USER)
    await Team.insertMany(BACKUP_TEAM)
    await UserType.insertMany(BACKUP_USERTYPE)

    mongoose.connection.close(true);
})


describe('[SUPERTEST] [USER]  /api/v1/user', () => {

    var token = jwt.sign({email:"dd@eclub.com"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
    header={'Content-Type':'application/json', token:token};
    console.log(header)

    /* ---  GET USER --- */
    test('<200> GET all user', () => {
        return request(app).get('/api/v1/user')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    /* ---  GET SPECIFIC USER --- */
    let id = "629cd06cf9407f999c3b26ed";

    test('<200> GET specific user', () => {
        return request(app).get('/api/v1/user/'+id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    let id1 = "629cd06cf9407f999c3b2632";

    test('<404> GET all user with not found id', () => {
        return request(app).get('/api/v1/user/'+id1+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    let id2 = "ciao";

    test('<500> GET all user with wrong id format', () => {
        return request(app).get('/api/v1/user/'+id2+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    /* --- POST USER--- */
    test('<200> POST new user', () => {
        return request(app).post('/api/v1/user/')
        .send({ 
                email:"test@test.it",
                password:"testtest",
                name:"Test",
                surname:"Test",
                birth:"01/01/1111",
                a_type:"62987f2b04224e2d33075e22",
                added_by:"62987f9e04224e2d33075e28" 
        })
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<400> POST new user with error in validation', () => {
        return request(app).post('/api/v1/user/')
        .send({})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    /* --- PATCH TEAM --- */
    test('<200> PATCH specific user', () => {
        return request(app).patch('/api/v1/user/'+id+'/')
        .send({ 
            name:"Test3",
        })  
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    let id10="629cd06cf9407f999c3b2610"

    test('<404> PATCH specific user with wrong id', () => {
        return request(app).patch('/api/v1/user/'+id10+'/')
        .send({ 
            name:"Test3",
        })  
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<400> PATCH specific user', () => {
        return request(app).patch('/api/v1/user/'+id+'/')
        .send({ 
            email:"dd@eclub.com" 
        })  
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    let id11="ciao"

    /* --- DELETE USER--- */
    test('<200> DELETE specific user', () => {
        return request(app).delete('/api/v1/user/'+id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> DELETE specific user with not found id', () => {
        return request(app).delete('/api/v1/user/'+id10+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> DELETE specific user with wrong id format', () => {
        return request(app).delete('/api/v1/user/'+id11+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

   
})
