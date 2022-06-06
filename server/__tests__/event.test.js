const app = require('../index');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
require("dotenv").config();

const Summoning = require('../models/Summoning');
const Event = require('../models/Event');
const Evaluation = require('../models/Evaluation');
const Attendance = require('../models/Attendance');

let BACKUP_EVENT
let BACKUP_SUMMONING
let BACKUP_EVALUATION
let BACKUP_ATTENDANCE

jest.setTimeout(9000);

beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await mongoose.connect(process.env.DATABASETEST_URL);

    BACKUP_EVENT = await Event.find({}).exec()
    BACKUP_SUMMONING = await Summoning.find({}).exec()
    BACKUP_EVALUATION = await Evaluation.find({}).exec()
    BACKUP_ATTENDANCE = await Attendance.find({}).exec()
})

afterAll( async () =>{

    await Event.deleteMany({})
    await Summoning.deleteMany({})
    await Evaluation.deleteMany({})
    await Attendance.deleteMany({})

    await Event.insertMany(BACKUP_EVENT)
    await Summoning.insertMany(BACKUP_SUMMONING)
    await Evaluation.insertMany(BACKUP_EVALUATION)
    await Attendance.insertMany(BACKUP_ATTENDANCE)

    mongoose.connection.close(true);
})

describe('[SUPERTEST] [Eventi]  /api/v2/event', () => {
    

    var token = jwt.sign({email:"carlo@carletto.it"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
    header={'Content-Type':'application/json', token:token};
    console.log(header)
    let validEvent_id="629df8dad687388020536ee0"
    let InvalidEvent_id="629b19c317d2c125ef112c69"
    let Invalid_id="aa"
    let validTeam_id='629df54bda461f6de74cc39b';

    /* ---  GET EVENTS --- */

    test('<200> GET all Events', () => {
        return request(app).get('/api/v2/event')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    /* ---  GET SPECIFIC EVENT --- */

    test('<200> GET specific Event', () => {
        return request(app).get('/api/v2/event/'+validEvent_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> GET specific Event with not found id', () => {
        return request(app).get('/api/v2/event/'+InvalidEvent_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> GET specific Event with wrong id format', () => {
        return request(app).get('/api/v2/event/'+Invalid_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    /* ---  GET EVENT by specific TEAM --- */

    test('<200> GET Events by specific Team', () => {
        return request(app).get('/api/v2/event/team/'+validTeam_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });
   
    test('<404> GET Events by specific Team with not found id', () => {
        return request(app).get('/api/v2/event/team/'+InvalidTeam_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });
    

    test('<500> GET Events by specific Team with wrong id format', () => {
        return request(app).get('/api/v2/event/team/'+Invalid_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });
    
    /* ---  POST EVENT --- */

    test('<200> POST Event', () => {
        return request(app).post('/api/v2/event')
        .send({
            title: "titolo",
            date: "2022-06-05T12:30",
            description: "descrizione",
            teams:["629df54bda461f6de74cc39b"],
            e_type:"629643542cfad8fa95f70c1e",
            added_by: "628905acfc8a650ccd42368e",})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<400> POST Event with error in validation', () => {
        return request(app).post('/api/v2/event')
        .send({})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    /* ---  PATCH EVENT --- */

    test('<200> PATCH Event', () => {
        return request(app).patch('/api/v2/event/'+validEvent_id)
        .send({
            title: "titolo2",
            })
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> PATCH Event with not found id', () => {
        return request(app).patch('/api/v2/event/'+InvalidEvent_id)
        .send({})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    /* ---  DELETE EVENT --- */

    test('<200> DELETE specific Event', () => {
        return request(app).delete('/api/v2/event/'+validEvent_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    }); 

    test('<404> DELETE specific Event with not found id', () => {
        return request(app).delete('/api/v2/event/'+InvalidEvent_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> DELETE specific Event with wrong id format', () => {
        return request(app).delete('/api/v2/event/'+Invalid_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });
})


