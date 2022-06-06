const app = require('../index')
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
require("dotenv").config();

jest.setTimeout(9000);
let userTest //data testing


beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await mongoose.connect(process.env.DATABASE_URL);

    userTest = new User({email: "test@test.com", 
                        name: "Luca", 
                        password: "ciaociao",
                        surname:"Test", 
                        birth:"01/01/1001", 
                        a_type:"629883bd16e83ec5f33247bf",
                        added_by:"629883bd16e83ec5f33247bf"})
    await userTest.save();
})
afterAll( () =>{
    await User.deleteMany({})

    mongoose.connection.close(true);
})


describe('[SUPERTEST] [attendance]  /api/v1/auth', () => {

    var token = jwt.sign({email:"test@test.com"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
    header={'Content-Type':'application/json', token:token};
    console.log(header)


    //---POST    
    test('<200> auth with right email and password', () => {
        return request(app).post('/api/v1/auth')
        .send({email: "test@test.com", password: "ciaociao"})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<400> auth with wrong email', () => {
        return request(app).post('/api/v1/auth')
        .send({email: "test@test.it", password: "ciaociao"})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    test('<400> auth with wrong password', () => {
        return request(app).post('/api/v1/auth')
        .send({email: "test@test.com", password: "password"})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    test('<400> auth with validation error', () => {
        return request(app).post('/api/v1/auth')
        .send({})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    //---token related error
    test('<401> get without token', () => {
        return request(app).get('/api/v1/auth')
        .set('Accept', 'application/json')
        .expect(401)
    });

    let wrongtoken = "asdjnsfinwsed"
    test('<403> get with wrong token', () => {
        return request(app).get('/api/v1/auth')
        .set('auth-token', wrongtoken).set('Accept', 'application/json')
        .expect(403)
    });
})
