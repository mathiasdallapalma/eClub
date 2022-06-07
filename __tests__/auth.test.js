const app = require('../app')
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const User = require('../models/user.js');
const UserType = require('../models/usertype.js');
const bcrypt = require('bcryptjs')


require("dotenv").config();


jest.setTimeout(9000);
let userTest //data testing
let utTest //data testing


beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await mongoose.connect(process.env.DATABASE_TEST_URL);
   
    utTest = new UserType({
        name:"Dirigente del Direttivo",
        type:"0"
    })
    await utTest.save();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("ciaociao", salt);

    userTest = new User({email: "test@test.com", 
                        name: "Luca", 
                        password: hashedPassword,
                        surname:"Test", 
                        birth:"01/01/1001", 
                        a_type: utTest._id
                        })
    await userTest.save();
})
afterAll( async () =>{
    await User.deleteMany({})
    await UserType.deleteMany({})

    mongoose.connection.close(true);
})


describe('[SUPERTEST] [AUTHENTICATION]  /api/v1/auth', () => {

    var token = jwt.sign({email:"test@test.com"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
    header={'Content-Type':'application/json', token:token};
    console.log(header)


    //--- POST LOGIN USER  
    test('<200> POST AUTH with right email and password', () => {
        return request(app).post('/api/v1/auth')
        .send({email: "test@test.com", password: "ciaociao"})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<400> POST AUTH with wrong email', () => {
        return request(app).post('/api/v1/auth')
        .send({email: "test@test.it", password: "ciaociao"})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    test('<400> POST AUTH with wrong password', () => {
        return request(app).post('/api/v1/auth')
        .send({email: "test@test.com", password: "password"})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    test('<400> POST AUTH with validation error', () => {
        return request(app).post('/api/v1/auth')
        .send({})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });
})
