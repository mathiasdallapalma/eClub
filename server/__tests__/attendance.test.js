const app = require('../app')
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const Attendance = require('../models/Attendance');
const Event = require('../models/Event');
const User = require('../models/User');
const Team = require('../models/Team');
const EventType = require('../models/EventType');

const { EventEmitter } = require('nodemailer/lib/xoauth2');

require("dotenv").config();

jest.setTimeout(9000);

let userTest, userTest2
let teamTest
let EventTypeTest
let eventTest
let attendanceTest

let WrongId = "629cd06cf9407f999c3b2632";
let WrongFormatId = "ciao";


beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await mongoose.connect(process.env.DATABASE_TEST_URL);
    
    userTest = new User({email: "test@test.com", 
                        name: "Luca", 
                        password: "ciaociao",
                        surname:"Test", 
                        birth:"01/01/1001", 
                        a_type:"629883bd16e83ec5f33247bf",
                        added_by:"629883bd16e83ec5f33247bf"
    });

    await userTest.save();       
    
    userTest2 = new User({
        email: "test2@test2.com", 
        name: "Luca", 
        password: "ciaociao",
        surname:"Test", 
        birth:"01/01/1001", 
        a_type:"629883bd16e83ec5f33247bf",
        added_by:"629883bd16e83ec5f33247bf"
    });

    await userTest2.save();  
    
    teamTest = new Team({ 
        category:"Test",
        added_by:"62987f9e04224e2d33075e28" 
    });
    await teamTest.save();

    EventTypeTest = new EventType({
        name: "Partita",
        type: "0"
    });

    await EventTypeTest.save();

    eventTest = new Event({
                        title: "Evento", 
                        date: "10/10/2010", 
                        teams: teamTest._id, 
                        describe:"Descrizione Evento", 
                        e_type: EventTypeTest._id,
                        added_by:userTest._id,
    });

    await eventTest.save();
    
    attendanceTest = new Attendance({
                        value: "false",
                        event: eventTest._id,
                        player: userTest._id,
                        added_by: userTest._id
    });

    await attendanceTest.save();                   
})


afterAll( async () =>{
    await User.deleteMany({})
    await Attendance.deleteMany({})
    await Event.deleteMany({})
    await Team.deleteMany({})
    await EventType.deleteMany({})

    mongoose.connection.close(true);
})

describe('[SUPERTEST] [ATTENDANCE]  /api/v2/attendance', () => {
    var token = jwt.sign({email:"test@test.com"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
    header={'Content-Type':'application/json', token:token};
    
    //--- GET ATTENDANCE
    test('<200> GET ATTENDANCE', () => {
        return request(app).get('/api/v2/attendance')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

       /* ---  GET SPECIFIC ATTENDANCE by event--- */
       test('<200> GET all attendance of a specific event', () => {
        return request(app).get('/api/v2/attendance/event/'+eventTest._id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> GET all attendance with wrong id', () => {
        return request(app).get('/api/v2/attendance/event/'+WrongId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> GET all attendance with wrong id format', () => {
        return request(app).get('/api/v2/attendance/event/'+WrongFormatId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    /* ---  GET SPECIFIC ATTENDANCE by player--- */
    test('<200> GET all attendance of a specific player', () => {
        return request(app).get('/api/v2/attendance/player/'+userTest._id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> GET all attendance with wrong id', () => {
        return request(app).get('/api/v2/attendance/player/'+WrongId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> GET all attendance with wrong id format', () => {
        return request(app).get('/api/v2/attendance/player/'+WrongFormatId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    //--- POST ATTENDANCE 
    test('<200> POST ATTENDANCE>', () => {
        return request(app).post('/api/v2/attendance')
        .send({ value: "true",
                added_by: userTest._id,
                event: eventTest._id,
                player: userTest2._id
        })
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<400> POST with error in body validation', () => {
        return request(app).post('/api/v2/attendance')
        .send({})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    //--- PATCH ATTENDANCE 
     test('<200> PATCH ATTENDANCE >', () => {
        return request(app).patch('/api/v2/attendance/'+attendanceTest._id)
        .send({value: "false",
               added_by: userTest._id})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> PATCH with non existing id', () => {
        return request(app).patch('/api/v2/attendance/'+WrongId+'/')
        .send({value: "false",
              added_by: userTest._id }) 
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> PATCH with wrong id format', () => {
        return request(app).patch('/api/v2/attendance/'+WrongFormatId+'/')
        .send({value: "false",
               added_by: userTest._id})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    //--- DELETE ATTENDANCE 
    test('<200 DELETE ATTENDANCE >', () => {
        return request(app).delete('/api/v2/attendance/'+attendanceTest._id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> DELETE ATTENDANCE with non existing id', () => {
        return request(app).patch('/api/v2/attendance/'+WrongId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500 DELETE ATTENDANCE with error in format id>', () => {
        return request(app).delete('/api/v2/attendance/'+WrongFormatId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

})
