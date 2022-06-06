const app = require('../index')
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const Attendance = require('../models/Attendance');
const Event = require('../models/Event');
const User = require('../models/User');

require("dotenv").config();

jest.setTimeout(9000);

let BACKUP_ATTENDANCE
let BACKUP_EVENT
let BACKUP_USER


beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await mongoose.connect(process.env.DATABASE_URL);
    BACKUP_USER = await User.find({}).exec()
    BACKUP_ATTENDANCE = await Attendance.find({}).exec()
    BACKUP_EVENT = await Event.find({}).exec()
})


afterAll( () =>{
    await User.deleteMany({})
    await Attendance.deleteMany({})
    await Event.deleteMany({})
    await User.insertMany(BACKUP_USER)
    await Attendance.insertMany(BACKUP_ATTENDANCE)
    await Event.insertMany(BACKUP_EVENT)

    mongoose.connection.close(true);
})

describe('[SUPERTEST] [attendance]  /api/v2/attendance', () => {
    var token = jwt.sign({email:"giovanni@storti.it"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
    header={'Content-Type':'application/json', token:token};
    console.log(header)


    //---GET

    test('<200>', () => {
        return request(app).get('/api/v2/attendance')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });


    //---GET specific attendance
    
    let rightid = '629b19c417d2c125ef102c71';
    test('<200>', () => {
        return request(app).get('/api/v2/attendance/'+rightid)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    let wrongid1 = '629b19c417d2c125ef200c71';
    test('<400> get specific with existing id but wrong object', () => {
        return request(app).get('/api/v2/attendance/'+wrongid1)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    let wrongid2 = '142345456342424';
    test('<404> get specific with non existing id', () => {
        return request(app).get('/api/v2/attendance/'+wrongid2)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    let wrongid500 = 'ciaociao';
    test('<500> get specific with wrong format of id', () => {
        return request(app).get('/api/v2/attendance/'+wrongid500)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });


    //---POST

    test('<200>', () => {
        return request(app).post('/api/v2/attendance')
        .send({event: "629b19c317d2c125ef102c69", player:"62987f9e04224e2d33075e28", value:"0",added_by:"62987f9e04224e2d33075e28" })
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<400> post with empty request body', () => {
        return request(app).post('/api/v2/attendance')
        .send()
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    //---DELETE

    test('<200>', () => {
        return request(app).delete('/api/v2/attendance'+rightid)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });


    //---PATCH

    test('<200>', () => {
        return request(app).patch('/api/v2/attendance'+rightid)
        .send({event: "629b19c317d2c125ef102c69", player:"62987f9e04224e2d33075e28", value:"0",added_by:"62987f9e04224e2d33075e28" })
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<500> patch with wrong format of id', () => {
        return request(app).patch('/api/v2/attendance/'+wrongid500)
        .send({event: "629b19c317d2c125ef102c69", player:"62987f9e04224e2d33075e28", value:"7",added_by:"62987f9e04224e2d33075e28" })
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    //---token related error
    test('<401> get without token', () => {
        return request(app).get('/api/v2/attendance')
        .set('Accept', 'application/json')
        .expect(401)
    });

    let wrongtoken = 'asdjnsfinwsed'
    test('<403> get with wrong token', () => {
        return request(app).get('/api/v2/attendance')
        .set('auth-token', wrongtoken).set('Accept', 'application/json')
        .expect(403)
    });
})
