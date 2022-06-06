const app = require('../index');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const material = require('../models/material');
require("dotenv").config();

jest.setTimeout(9000);

let BACKUP_MATERIALS


beforeAll( async () => {
    jest.setTimeout(8000);

    BACKUP_MATERIALS = await material.find({}).exec()

    app.locals.db = await mongoose.connect(process.env.DATABASE_URL);
})

afterAll( async () =>{

    await material.deleteMany({})
    await material.insertMany(BACKUP_MATERIALS)

    mongoose.connection.close(true);
})

describe('[SUPERTEST] [Material]  /api/v2/material', () => {

    var token = jwt.sign({email:"carlo@carletto.it"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
    header={'Content-Type':'application/json', token:token};
    console.log(header)

    /* ---  GET MATERIALS --- */

    test('<200> GET all Material', () => {
        return request(app).get('/api/v2/material')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    let validMaterial_id="629c6cb28caaffd8a28ed69a"
    let InvalidMaterial_id="629b19c317d2c125ef112c69"
    let Invalid_id="aa"

    /* ---  GET SPECIFIC MATERIAL --- */

    test('<200> GET specific Material', () => {
        return request(app).get('/api/v2/material/'+validMaterial_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> GET specific Material with not found id', () => {
        return request(app).get('/api/v2/material/'+InvalidMaterial_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> GET specific Material with wrong id format', () => {
        return request(app).get('/api/v2/material/'+Invalid_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    /* ---  GET MATERIAL BY SPECIFIC PLAYER --- */

    let validPlayer_id='62987f9e04224e2d33075e28'

    test('<200> GET specific Material by Player', () => {
        return request(app).get('/api/v2/material/player/'+validPlayer_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> GET specific Material by Player with not found id', () => {
        return request(app).get('/api/v2/material/player/'+InvalidMaterial_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> GET specific Material by Player with wrong id format', () => {
        return request(app).get('/api/v2/material/player/'+Invalid_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    /* ---  POST MATERIAL --- */
    
    test('<200> POST Material', () => {
        return request(app).post('/api/v2/material')
        .send({
            description: "scarpe 42",
            player: "629b19c317d2c125ef112c69",
            given_at: "2022-06-05",
            returned_at: "2022-06-06",
            added_by: "628905acfc8a650ccd42368e",})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });
 
    test('<500> POST Material with error in validation', () => {
        return request(app).post('/api/v2/material')
        .send({})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    /* ---  PATCH SPECIFIC MATERIAL --- */

    test('<200> PATCH Material', () => {
        return request(app).patch('/api/v2/material/'+validMaterial_id)
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

    test('<404> PATCH Material with not found id', () => {
        return request(app).patch('/api/v2/material/'+InvalidMaterial_id)
        .send({})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    /* ---  DELETE SPECIFIC MATERIAL --- */

    test('<200> DELETE specific Material', () => {
        return request(app).delete('/api/v2/material/'+validMaterial_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    }); 

    test('<404> DELETE specific Material with not found id', () => {
        return request(app).delete('/api/v2/material/'+InvalidMaterial_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> DELETE specific Material with wrong id format', () => {
        return request(app).delete('/api/v2/material/'+Invalid_id)
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

})


