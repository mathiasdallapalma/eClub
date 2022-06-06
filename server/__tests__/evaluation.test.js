const app = require('../index')
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const Evaluation = require('../models/Evaluation');
const Event = require('../models/Event');
const User = require('../models/User');

require("dotenv").config();

jest.setTimeout(9000);

let userTest
let evaluationTest
let WrongId = "629cd06cf9407f999c3b2632";
let WrongFormatId = "ciao";


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

    evaluationTest = new Evaluation({value: "7",
                                    added_by: userTest._id})
})


afterAll( () =>{
    await User.deleteMany({})
    await Evaluation.deleteMany({})

    mongoose.connection.close(true);
})

describe('[SUPERTEST] [evaluation]  /api/v2/evaluation', () => {
    var token = jwt.sign({email:"test@test.com"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
    header={'Content-Type':'application/json', token:token};
    console.log(header)


    //---GET

    test('<200>', () => {
        return request(app).get('/api/v2/evaluation')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });


    //---GET specific
    
    test('<200>', () => {
        return request(app).get('/api/v2/evaluation/'+evaluationTest._id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<404> get specific with non existing id', () => {
        return request(app).get('/api/v2/evaluation/'+WrongFormatId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> get specific with wrong format of id', () => {
        return request(app).get('/api/v2/evaluation/'+WrongFormatId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });


    //---POST

    test('<200>', () => {
        return request(app).post('/api/v2/evaluation')
        .send({value: "7",
               added_by: userTest._id})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<400> post with error in body validation', () => {
        return request(app).post('/api/v2/evaluation')
        .send({})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    //---PATCH

     test('<200>', () => {
        return request(app).patch('/api/v2/evaluation'+evaluationTest._id)
        .send({value: "7",
               added_by: userTest._id})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<400>patch with validation error', () => {
        return request(app).patch('/api/v1/team/'+WrongFormatId+'/')
        .send({value: "7",
               added_by: userTest._id})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    test('<404> patch with non existing id', () => {
        return request(app).patch('/api/v2/evaluation/'+WrongId+'/')
        .send({value: "7",
              added_by: userTest._id }) 
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });


    //---DELETE

    test('<200>', () => {
        return request(app).delete('/api/v2/evaluation'+evaluationTest._id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<400> delete with non existing id', () => {
        return request(app).patch('/api/v1/team/'+WrongId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    test('<500>', () => {
        return request(app).delete('/api/v2/evaluation'+WrongFormatId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    //---token related error
    test('<401> get without token', () => {
        return request(app).get('/api/v2/evaluation')
        .set('Accept', 'application/json')
        .expect(401)
    });

    let wrongtoken = "asdjnsfinwsed"
    test('<403> get with wrong token', () => {
        return request(app).get('/api/v2/evaluation')
        .set('auth-token', wrongtoken).set('Accept', 'application/json')
        .expect(403)
    });
})
