const app = require('../index');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const med = require('../models/med');
require("dotenv").config();

jest.setTimeout(9000);

let BACKUP_MED

beforeAll( async () => {
    jest.setTimeout(8000);

    BACKUP_MED = await med.find({}).exec()

    app.locals.db = await mongoose.connect(process.env.DATABASE_URL);
})

afterAll( async () =>{

    await med.deleteMany({})
    await med.insertMany(BACKUP_MED)
    mongoose.connection.close(true);
})

describe('[SUPERTEST] [Meds Certificate]  /api/v2/meds', () => {

    var token = jwt.sign({email:"carlo@carletto.it"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
    header={'Content-Type':'application/json', token:token};
    console.log(header)

    /* ---  GET MEDS --- */

    test('<200> GET all Meds Certificate', () => {
        return request(app).get('/api/v2/med')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    let validMeds_id="629b6c2bc210a21256ce6154"
    let InvalidMeds_id="629b19c311111125ef112c69"
    let Invalid_id="aa"

    /* ---  GET SPECIFIC MEDS --- */

    test('<200> GET specific Meds Certificate', () => {
        return request(app).get('/api/v2/med/'+validMeds_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> GET specific Meds Certificate with not found id', () => {
        return request(app).get('/api/v2/med/'+InvalidMeds_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> GET specific Meds Certificate with wrong id format', () => {
        return request(app).get('/api/v2/med/'+Invalid_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    /* ---  GET MED BY SPECIFIC PLAYER --- */

    let validPlayer_id='62987f9e04224e2d33075e28'

    test('<200> GET specific Meds Certificate by Player', () => {
        return request(app).get('/api/v2/med/player/'+validPlayer_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> GET specific Meds Certificate by Player with not found id', () => {
        return request(app).get('/api/v2/med/player/'+InvalidMeds_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> GET specific Meds Certificate by Player with wrong id format', () => {
        return request(app).get('/api/v2/med/player/'+Invalid_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    /* ---  POST MEDS --- */
    
    test('<200> POST Meds Certificate', () => {
        return request(app).post('/api/v2/med')
        .send({
            released_at: "2022-06-06",
            expiring_at: "2022-06-06",
            player: "628905acfc8a650ccd42368e",
            verified: "false",
            added_by: "628905acfc8a650ccd42368e",})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    
    test('<500> POST Meds Certificate with error in validation', () => {
        return request(app).post('/api/v2/med')
        .send({})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    /* ---  PATCH SPECIFIC MEDS --- */
    
    test('<200> PATCH Meds Certificate', () => {
        return request(app).patch('/api/v2/med/'+validMeds_id)
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

    test('<404> PATCH Meds Certificate with with not found id', () => {
        return request(app).patch('/api/v2/med/'+InvalidMeds_id)
        .send({})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    /* ---  DELETE SPECIFIC MEDS --- */

    test('<200> DELETE specific Meds Certificate', () => {
        return request(app).delete('/api/v2/med/'+validMeds_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    }); 

    test('<404> DELETE specific Meds Certificate with not found id', () => {
        return request(app).delete('/api/v2/med/'+InvalidMeds_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> DELETE specific Meds Certificate with wrong id format', () => {
        return request(app).delete('/api/v2/med/'+Invalid_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    
    

})


