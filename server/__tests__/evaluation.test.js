const app = require('../app')
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const Evaluation = require('../models/Evaluation');
const Event = require('../models/Event');
const User = require('../models/User');
const EventType = require('../models/EventType');
const Team = require('../models/Team');

require("dotenv").config();

jest.setTimeout(9000);

let userTest
let teamTest
let EventTypeTest
let evaluationTest
let eventTest

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
    })

    await userTest.save();   

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


    evaluationTest = new Evaluation({
                        value: "7",
                        added_by: userTest._id, 
                        event: eventTest._id,
                        player: userTest._id
    })
    
    await evaluationTest.save();    

})


afterAll( async () =>{
    await User.deleteMany({})
    await Evaluation.deleteMany({})
    await Event.deleteMany({})
    await Team.deleteMany({})
    await EventType.deleteMany({})

    mongoose.connection.close(true);
})

describe('[SUPERTEST] [EVALUATION]  /api/v2/evaluation', () => {

    var token = jwt.sign({email:"test@test.com"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
    header={'Content-Type':'application/json', token:token};
    console.log(header)

    //--- GET ALL EVALUATION
    test('<200> GET EVALUATION', () => {
        return request(app).get('/api/v2/evaluation')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    /* ---  GET SPECIFIC EVALUATION by event--- */
    test('<200> GET all evaluation of a specific event', () => {
        return request(app).get('/api/v2/evaluation/event/'+eventTest._id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> GET all evaluation with wrong id', () => {
        return request(app).get('/api/v2/evaluation/event/'+WrongId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> GET all evaluation with wrong id format', () => {
        return request(app).get('/api/v2/evaluation/event/'+WrongFormatId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    /* ---  GET SPECIFIC EVALUATION by player--- */
    test('<200> GET all evaluation of a specific player', () => {
        return request(app).get('/api/v2/evaluation/player/'+userTest._id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> GET all evaluation with wrong id', () => {
        return request(app).get('/api/v2/evaluation/player/'+WrongId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> GET all evaluation with wrong id format', () => {
        return request(app).get('/api/v2/evaluation/player/'+WrongFormatId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });


    //--- POST evaluation

    test('<200 POST EVALUATION>', () => {
        return request(app).post('/api/v2/evaluation')
        .send({
            value: "7",
            added_by: userTest._id
        })
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<400> POST EVALUATION with error in body validation', () => {
        return request(app).post('/api/v2/evaluation')
        .send({})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    //--- PATCH EVALUATION
    test('<200 PATCH EVALUATION>', () => {
        return request(app).patch('/api/v2/evaluation/'+evaluationTest._id+'/')
        .send({value: "7",
               added_by: userTest._id
        })
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> PATCH EVALUATION with non existing id', () => {
        return request(app).patch('/api/v2/evaluation/'+WrongId+'/')
        .send({value: "7",
              added_by: userTest._id }) 
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> PATCH EVALUATION with non wrong id format', () => {
        return request(app).patch('/api/v2/evaluation/'+WrongFormatId+'/')
        .send({value: "7",
              added_by: userTest._id }) 
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    //--- DELETE EVALUATION

    test('<200 DELETE EVALUATION >', () => {
        return request(app).delete('/api/v2/evaluation/'+evaluationTest._id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> DELETE EVALUATION with non existing id', () => {
        return request(app).delete('/api/v2/evaluation/'+WrongId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500 DELETE EVALUATION with wrong id format>', () => {
        return request(app).delete('/api/v2/evaluation/'+WrongFormatId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

})
