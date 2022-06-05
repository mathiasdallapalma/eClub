const app = require('../index.js');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const UserType = require('../models/UserType');

require("dotenv").config();

/* --- Set Timeout --- */
jest.setTimeout(9000);

/* --- Connection to Database --- */
let BACKUP_USERTYPE


beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await mongoose.connect(process.env.DATABASE_URL);
    BACKUP_USERTYPE = await UserType.find({}).exec()
})

/* --- Close Connection to Database--- */
afterAll( async () =>{
    await UserType.deleteMany({})
    await UserType.insertMany(BACKUP_USERTYPE)

    mongoose.connection.close(true);
})


describe('[SUPERTEST] [USER TYPE]  /api/v1/usertype', () => {

    var token = jwt.sign({email:"dd@eclub.com"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
    header={'Content-Type':'application/json', token:token};
    console.log(header)

    /* ---  GET USERTYPE --- */
    test('<200> GET all usertype', () => {
        return request(app).get('/api/v1/usertype')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    /* --- POST USER--- */
    test('<200> POST new usertype', () => {
        return request(app).post('/api/v1/usertype/')
        .send({ 
                name:"Test",
                type:"7"
        })
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<400> POST new usertype with error in validation', () => {
        return request(app).post('/api/v1/usertype/')
        .send({})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    /* --- PATCH TEAM --- */
    let id="62987f2b04224e2d33075e22";
    test('<200> PATCH specific usertype', () => {
        return request(app).patch('/api/v1/usertype/'+id+'/')
        .send({ 
            name:"Test modificato"
        })  
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    let id10="62987f2b04224e2d33075e10"

    test('<404> PATCH specific usertype with wrong id', () => {
        return request(app).patch('/api/v1/usertype/'+id10+'/')
        .send({ 
            name:"Test3",
        })  
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });
    
    let id11="ciao"
    test('<400> PATCH specific usertype', () => {
        return request(app).patch('/api/v1/usertype/'+id+'/')
        .send({
            type:"0"
        })  
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    /* --- DELETE USER--- */
    test('<200> DELETE specific usertype', () => {
        return request(app).delete('/api/v1/usertype/'+id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> DELETE specific usertype with not found id', () => {
        return request(app).delete('/api/v1/usertype/'+id10+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> DELETE specific usertype with wrong id format', () => {
        return request(app).delete('/api/v1/usertype/'+id11+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

   
})
