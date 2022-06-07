const app = require('../app');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
require("dotenv").config();

const Summoning = require('../models/summoning.js');
const Event = require('../models/event.js');
const Evaluation = require('../models/evaluation.js');
const Attendance = require('../models/attendance.js');
const Team = require('../models/team.js');
const EventType = require('../models/eventtype.js');

let validEvent_id=""
let InvalidEvent_id="629b19c317d2c125ef112c69"
let Invalid_id="aa"
let validTeam_id="";
let validEventType_id="";

jest.setTimeout(9000);

beforeAll( async () => {
    jest.setTimeout(8000);

    app.locals.db = await mongoose.connect(process.env.DATABASE_TEST_URL);

    eventTypeTest = new EventType({
                                    name: "Test",
                                    type: "7"
                                });
    await eventTypeTest.save();

    teamTest = new Team({
                        category: "Esordienti",
                        status: "0",
                        hidden: "0",
                        added_by: "956bca9fd92d45c042f24945"
                    });
    await teamTest.save(); 

    eventTest = new Event({
                        title: "Partita Finale",
                        date: "2020-03-29T15:30:00.000",
                        description: "Finale di campionato contro Mezzoorona AC",
                        added_by: "deade23131d123d1e1",
                        e_type: eventTypeTest._id,
                        teams: [
                            teamTest._id
                        ]
                    });

    
    await eventTest.save();  
    
    validEventType_id=eventTypeTest._id; 

    validEvent_id=eventTest._id
    validTeam_id=teamTest._id

    

    
})

afterAll( async () =>{

    
    await Team.deleteMany({})
    await Event.deleteMany({})
    await Summoning.deleteMany({})
    await Evaluation.deleteMany({})
    await Attendance.deleteMany({})
    

    mongoose.connection.close(true);
})

describe('[SUPERTEST] [Eventi]  /api/v2/event', () => {
    

    var token = jwt.sign({email:"carlo@carletto.it"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
    header={'Content-Type':'application/json', token:token};
    console.log(header)
    

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
        return request(app).get('/api/v2/event/team/'+InvalidEvent_id)
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
            e_type: validEventType_id,
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
            title: "titolo2"
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


