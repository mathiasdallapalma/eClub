const app = require('../app');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const User = require('../models/user.js');


require("dotenv").config();

/* --- Set Timeout --- */
jest.setTimeout(9000);

let userTest //data testing
let WrongId = "629cd06cf9407f999c3b2632";
let WrongFormatId = "ciao";


/* --- Connection to Database --- */
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


})

/* --- Close Connection to Database--- */
afterAll( async () =>{

    await User.deleteMany({})
    mongoose.connection.close(true);
})


describe('[SUPERTEST] [USER]  /api/v1/user', () => {

    var token = jwt.sign({email:"test@test.com"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
    header={'Content-Type':'application/json', token:token};
    console.log(header)

    /* ---  GET USER --- */
    test('<200> GET all user', () => {
        return request(app).get('/api/v1/user')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
       
    });

    /* ---  GET SPECIFIC USER --- */

    test('<200> GET specific user', () => {
        return request(app).get('/api/v1/user/'+userTest._id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> GET all user with not found id', () => {
        return request(app).get('/api/v1/user/'+WrongId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> GET all user with wrong id format', () => {
        return request(app).get('/api/v1/user/'+WrongFormatId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    /* --- POST USER--- */
    test('<200> POST new user', () => {
        return request(app).post('/api/v1/user/')
        .send({ 
                email:"test2@test.it",
                password:"testtest",
                name:"Test",
                surname:"Test",
                birth:"01/01/1111",
                a_type:"629883bd16e83ec5f33247bf",
                added_by:"62987f9e04224e2d33075e28" 
        })
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<400> POST new user with error in validation', () => {
        return request(app).post('/api/v1/user/')
        .send({})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    /* --- PATCH TEAM --- */
    test('<200> PATCH specific user', () => {
        return request(app).patch('/api/v1/user/'+userTest._id+'/')
        .send({ 
            name:"Marco",
        })  
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });


    test('<404> PATCH specific user with wrong id', () => {
        return request(app).patch('/api/v1/user/'+WrongId+'/')
        .send({ 
            name:"Test3",
        })  
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<400> PATCH specific user', () => {
        return request(app).patch('/api/v1/user/'+userTest._id+'/')
        .send({ 
            email:"test@test.com" 
        })  
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    /* --- DELETE USER--- */
    test('<200> DELETE specific user', () => {
        return request(app).delete('/api/v1/user/'+userTest._id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> DELETE specific user with not found id', () => {
        return request(app).delete('/api/v1/user/'+WrongId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> DELETE specific user with wrong id format', () => {
        return request(app).delete('/api/v1/user/'+WrongFormatId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });
   
})
