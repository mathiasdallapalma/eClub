const app = require('../app')
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
let userTest //data testing
let communicationTest
let teamTest
let WrongId = "629cd06cf9407f999c3b2632";
let WrongFormatId = "ciao";

beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await mongoose.connect(process.env.DATABASE_TEST_URL);

    userTest = new User({
                        email: "test@test.com", 
                        name: "Luca", 
                        password: "ciaociao",
                        surname:"Test", 
                        birth:"01/01/1001", 
                        a_type:"629883bd16e83ec5f33247bf",
                        added_by:"629883bd16e83ec5f33247bf"
    })

    await userTest.save();

    teamTest = new Team({
                        category: "Test",
                        added_by: userTest._id 
    })

    await teamTest.save();

    communicationTest = new Communication({
                        team: teamTest._id,
                        subject:"Comunication", 
                        text:"Description comunication",
                        added_by: userTest._id })
    await communicationTest.save();
})

/* --- Close Connection to Database--- */
afterAll( async () =>{

    await User.deleteMany({})
    await Team.deleteMany({})
    await Communication.deleteMany({})

    mongoose.connection.close(true);
})


describe('[SUPERTEST] [communication]  /api/v2/communication', () => {
    var token = jwt.sign({email:"test@test.com"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
    header={'Content-Type':'application/json', token:token};
    console.log(header)


    //--- GET ALL COMMUNICATION

    test('<200> GET COMMUNICATIONS', () => {
        return request(app).get('/api/v2/communication')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });


    //---GET COMMUNICATION SPECIFIC
    test('<200> GET COMMUNICATION specific', () => {
        return request(app).get('/api/v2/communication/'+communicationTest._id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> GET COMMUNICATION specific with non existing id', () => {
        return request(app).get('/api/v2/communication/'+WrongId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> GET COMMUNICATION specific with wrong format of id', () => {
        return request(app).get('/api/v2/communication/'+WrongFormatId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });


    //--- POST COMMUNICATION
    test('<200> POST COMMUNICATION ', () => {
        return request(app).post('/api/v2/communication')
        .send({
                teams: teamTest._id,
                subject:"test",
                text:"test",
                added_by: userTest._id 
        })
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<400> post with error in body validation', () => {
        return request(app).post('/api/v2/communication')
        .send({})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    //--- PATCH COMMUNICATION
    test('<200> PATCH COMMUNICATION', () => {
        return request(app).patch('/api/v2/communication/'+communicationTest._id)
        .send({
                teams: teamTest._id, 
                subject:"team meeting", 
                text:"Good morning, just a reminder of the meeting",
                added_by:userTest._id 
        })
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> PATCH COMMUNICATION with non existing id', () => {
        return request(app).patch('/api/v2/communication/'+WrongId+'/')
        .send({
            teams: teamTest._id, 
            subject:"team meeting", 
            text:"Good morning, just a reminder of the meeting",
            added_by:userTest._id 
        }) 
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> PATCH COMMUNICATION with erro in id format', () => {
        return request(app).patch('/api/v2/communication/'+WrongFormatId+'/')
        .send({
                teams: teamTest._id, 
                subject:"team meeting", 
                text:"Good morning, just a reminder of the meeting",
                added_by:userTest._id 
        }) 
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });


    //--- DELETE COMMUNICATION

    test('<200> DELETE COMMUNICATION', () => {
        return request(app).delete('/api/v2/communication/'+communicationTest._id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> DELETE COMMUNICATION with non existing id', () => {
        return request(app).delete('/api/v2/communication/'+WrongId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> DELETE COMMUNICATION with wrong id format', () => {
        return request(app).delete('/api/v2/communication/'+WrongFormatId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

})
