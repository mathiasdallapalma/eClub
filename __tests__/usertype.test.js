const app = require('../app');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const UserType = require('../models/UserType');

require("dotenv").config();

/* --- Set Timeout --- */
jest.setTimeout(9000);

let utTest //data testing
let WrongId = "629cd06cf9407f999c3b2632";
let WrongFormatId = "ciao";

/* --- Connection to Database --- */
beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await mongoose.connect(process.env.DATABASE_TEST_URL);

    utTest = new UserType({
                        name: "Dirigente del Direttivo", 
                        type: "0"
                        
    });
    await utTest.save();
})

/* --- Close Connection to Database--- */
afterAll( async () =>{

    await UserType.deleteMany({})
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

    /* --- POST USERTYPE--- */
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

    /* --- PATCH USERTYPE --- */
    test('<200> PATCH specific usertype', () => {
        return request(app).patch('/api/v1/usertype/'+utTest._id+'/')
        .send({ 
            name:"Test modificato"
        })  
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });


    test('<404> PATCH specific usertype with wrong id', () => {
        return request(app).patch('/api/v1/usertype/'+WrongId+'/')
        .send({ 
            name:"Test3",
        })  
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });
    
    test('<400> PATCH specific usertype', () => {
        return request(app).patch('/api/v1/usertype/'+utTest._id+'/')
        .send({
            type:"0"
        })  
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    /* --- DELETE USERTYPE --- */
    test('<200> DELETE specific usertype', () => {
        return request(app).delete('/api/v1/usertype/'+utTest._id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> DELETE specific usertype with not found id', () => {
        return request(app).delete('/api/v1/usertype/'+WrongId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> DELETE specific usertype with wrong id format', () => {
        return request(app).delete('/api/v1/usertype/'+WrongFormatId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

   
})
