const app = require('../index')
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const Evaluation = require('../models/Evaluation');
const Event = require('../models/Event');
const User = require('../models/User');

require("dotenv").config();

jest.setTimeout(9000);

let BACKUP_EVALUATION
let BACKUP_EVENT
let BACKUP_USER


beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await mongoose.connect(process.env.DATABASE_URL);
    BACKUP_USER = await User.find({}).exec()
    BACKUP_EVALUATION = await Evaluation.find({}).exec()
    BACKUP_EVENT = await Event.find({}).exec()
})


afterAll( () =>{
    await User.deleteMany({})
    await Evaluation.deleteMany({})
    await Event.deleteMany({})
    await User.insertMany(BACKUP_USER)
    await Evaluation.insertMany(BACKUP_EVALUATION)
    await Event.insertMany(BACKUP_EVENT)

    mongoose.connection.close(true);
})

describe('[SUPERTEST] [evaluation]  /api/v2/evaluation', () => {
    var token = jwt.sign({email:"giovanni@storti.it"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
    header={'Content-Type':'application/json', token:token};
    console.log(header)


    //---GET

    test('<200>', () => {
        return request(app).get('/api/v2/evaluation')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });


    //---GET specific
    
    let rightid = '629b19c417d2c125ef102c70';
    test('<200>', () => {
        return request(app).get('/api/v2/evaluation/'+rightid)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    let wrongid1 = '629b19c417d2c125ef200c71';
    test('<400> get specific with existing id but wrong object', () => {
        return request(app).get('/api/v2/evaluation/'+wrongid1)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    let wrongid2 = '142345456342424';
    test('<404> get specific with non existing id', () => {
        return request(app).get('/api/v2/evaluation/'+wrongid2)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    let wrongid500 = 'ciaociao';
    test('<500> get specific with wrong format of id', () => {
        return request(app).get('/api/v2/evaluation/'+wrongid500)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });


    //---POST a evaluation

    test('<200>', () => {
        return request(app).post('/api/v2/evaluation')
        .send({event: "629b19c317d2c125ef102c69", player:"62987f9e04224e2d33075e28", value:"7",added_by:"62987f9e04224e2d33075e28" })
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<400> post with empty request body', () => {
        return request(app).post('/api/v2/evaluation')
        .send()
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    //---DELETE a evaluation

    test('<200>', () => {
        return request(app).delete('/api/v2/evaluation'+rightid)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });


    //---PATCH a evaluation

    test('<200>', () => {
        return request(app).patch('/api/v2/evaluation'+rightid)
        .send({event: "629b19c317d2c125ef102c69", player:"62987f9e04224e2d33075e28", value:"7",added_by:"62987f9e04224e2d33075e28" })
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<500> patch with wrong format of id', () => {
        return request(app).patch('/api/v2/evaluation/'+wrongid500)
        .send({event: "629b19c317d2c125ef102c69", player:"62987f9e04224e2d33075e28", value:"7",added_by:"62987f9e04224e2d33075e28" })
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    //---token related error
    test('<401> get without token', () => {
        return request(app).get('/api/v2/evaluation')
        .set('Accept', 'application/json')
        .expect(401)
    });

    let wrongtoken = 'asdjnsfinwsed'
    test('<403> get with wrong token', () => {
        return request(app).get('/api/v2/evaluation')
        .set('auth-token', wrongtoken).set('Accept', 'application/json')
        .expect(403)
    });
})
