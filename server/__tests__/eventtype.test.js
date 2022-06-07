const app = require('../app');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const EventType = require('../models/eventtype.js');
require("dotenv").config();

jest.setTimeout(9000);

let validEventType_id=""
let InvalidEventType_id="629b19c317d2c125ef112c69"
let Invalid_id="aa"

beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await mongoose.connect(process.env.DATABASE_TEST_URL);

    eventTypeTest = new EventType({
        name: "Partita",
        type: "1"
      });

    await eventTypeTest.save();

    validEventType_id=eventTypeTest._id
    
    
})

afterAll( async () =>{
    await EventType.deleteMany({})

    mongoose.connection.close(true);
})

describe('[SUPERTEST] [EventType]  /api/v2/eventtype', () => {

    var token = jwt.sign({email:"carlo@carletto.it"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
    header={'Content-Type':'application/json', token:token};
    console.log(header)

    

     /* ---  GET EVENT_TYPES --- */

    test('<200> GET all EventTypes', () => {
        return request(app).get('/api/v2/eventtype')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    /* ---  POST EVENT_TYPE --- */
    
    test('<200> POST EventType', () => {
        return request(app).post('/api/v2/eventtype')
        .send({
            name:"nuovo tipo",
            type: 3,
            added_by: "628905acfc8a650ccd42368e",})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    
    test('<400> POST EventType with error in validation', () => {
        return request(app).post('/api/v2/eventtype')
        .send({})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    /* ---  PATCH EVENT_TYPE --- */

    test('<200> PATCH EventType', () => {
        return request(app).patch('/api/v2/eventtype/'+validEventType_id)
        .send({
            title: "titolo",
            date: "2022-06-05T12:30",
            description: "desctizione",
            teams:["6298c3103818deda59b34104"],
            e_type:"629643542cfad8fa95f70c1e",
            added_by: "628905acfc8a650ccd42368e",})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> PATCH Event with not found id', () => {
        return request(app).patch('/api/v2/eventtype/'+InvalidEventType_id)
        .send({})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    /* ---  DELETE EVENT_TYPE --- */

    test('<200> DELETE specific EventType', () => {
        return request(app).delete('/api/v2/eventtype/'+validEventType_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    }); 

    test('<404> DELETE specific EventType with not found id', () => {
        return request(app).delete('/api/v2/eventtype/'+InvalidEventType_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> DELETE specific EventType with wrong id format', () => {
        return request(app).delete('/api/v2/eventtype/'+InvalidEventType_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    
    

})


