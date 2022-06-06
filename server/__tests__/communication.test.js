const app = require('../index')
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const User = require('../models/User');
const Team = require('../models/Team');
const Communication = require('../models/Communication');

require("dotenv").config();

/* --- Set Timeout --- */
jest.setTimeout(9000);

/* --- Connection to Database --- */
let BACKUP_USER
let BACKUP_TEAM
let BACKUP_COMMUNICATION

beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await mongoose.connect(process.env.DATABASE_URL);
    BACKUP_USER = await User.find({}).exec()
    BACKUP_TEAM = await Team.find({}).exec()
    BACKUP_COMMUNICATION = await Communication.find({}).exec()
})

/* --- Close Connection to Database--- */
afterAll( async () =>{
    await User.deleteMany({})
    await Team.deleteMany({})
    await Communication.deleteMany({})
    await User.insertMany(BACKUP_USER)
    await Team.insertMany(BACKUP_TEAM)
    await Communication.insertMany(BACKUP_COMMUNICATION)

    mongoose.connection.close(true);
})


describe('[SUPERTEST] [communication]  /api/v2/communication', () => {
    var token = jwt.sign({email:"giovanni@storti.it"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
    header={'Content-Type':'application/json', token:token};
    console.log(header)


    //---GET

    test('<200>', () => {
        return request(app).get('/api/v2/communication')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });


    //---GET specific
    
    let rightid = "629b7ab33c28b53a5414bd26";
    test('<200>', () => {
        return request(app).get('/api/v2/communication/'+rightid)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    let wrongid1 = "629b19c417d2c125ef200c71";
    test('<400> get specific with existing id but wrong object', () => {
        return request(app).get('/api/v2/communication/'+wrongid1)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });
    
    let wrongid2 = "142345456342424";
    test('<404> get specific with non existing id', () => {
        return request(app).get('/api/v2/communication/'+wrongid2)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    let wrongid500 = "ciaociao";
    test('<500> get specific with wrong format of id', () => {
        return request(app).get('/api/v2/communication/'+wrongid500)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });


    //---POST

    test('<200>', () => {
        return request(app).post('/api/v2/communication')
        .send({team: "6298c3103818deda59b34104", subject:"team meeting", text:"Good morning, just a reminder of the meeting",added_by:"62987f9e04224e2d33075e28" })
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<400> post with error in body validation', () => {
        return request(app).post('/api/v2/communication')
        .send()
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    //---DELETE

    test('<200>', () => {
        return request(app).delete('/api/v2/communication'+rightid)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<500>', () => {
        return request(app).delete('/api/v2/communication'+wrongid500)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });
    

    //---PATCH

    test('<200>', () => {
        return request(app).patch('/api/v2/communication'+rightid)
        .send({team: "6298c3103818deda59b34104", subject:"team meeting", text:"Good morning, just a reminder of the meeting",added_by:"62987f9e04224e2d33075e28" })
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<500> patch with wrong format of id', () => {
        return request(app).patch('/api/v2/communication/'+wrongid500)
        .send({team: "6298c3103818deda59b34104", subject:"team meeting", text:"Good morning, just a reminder of the meeting",added_by:"62987f9e04224e2d33075e28" })
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    //---token related error
    test('<401> get without token', () => {
        return request(app).get('/api/v2/communication')
        .set('Accept', 'application/json')
        .expect(401)
    });

    let wrongtoken = "asdjnsfinwsed"
    test('<403> get with wrong token', () => {
        return request(app).get('/api/v2/communication')
        .set('auth-token', wrongtoken).set('Accept', 'application/json')
        .expect(403)
    });
})
