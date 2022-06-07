const app = require('../app');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const med = require('../models/med');
const User = require('../models/user.js');
require("dotenv").config();

jest.setTimeout(9000);

    let validMeds_id=""
    let InvalidMeds_id="629b19c311111125ef112c69"
    let Invalid_id="aa"
    let validPlayer_id=""

beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await mongoose.connect(process.env.DATABASE_TEST_URL);

    userTest = new User({email: "test@test.com", 
                        name: "Luca", 
                        surname:"Test",
                        password:"asd",
                        birth:"01/01/1001", 
                        a_type:"629883bd16e83ec5f33247bf",
                        added_by:"629883bd16e83ec5f33247bf"
    });
    medTest = new med({
        released_at: "2022-06-02T09:15:10.502Z",
        expiring_at: "2023-06-02T09:15:10.502Z",
        player: userTest._id,
        doctor: "Studio Medicina dello Sport Enrico Rossi",
        med_type: "Certificato medico agonistico",
        verified: true
      });

    await userTest.save();
    await medTest.save();

    validMeds_id=medTest._id
    validPlayer_id=userTest._id

   
})

afterAll( async () =>{
    await User.deleteMany({})
    await med.deleteMany({})
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


