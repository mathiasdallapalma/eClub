const app = require('../app');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const User = require('../models/User');
const Payment = require('../models/Payment');

require("dotenv").config();

/* --- Set Timeout --- */
jest.setTimeout(9000);


let paymentTest //data testing
let userTest
let WrongId = "629cd06cf9407f999c3b2632";
let WrongFormatId = "ciao";


/* --- Connection to Database --- */
beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await mongoose.connect(process.env.DATABASE_TEST_URL);

    userTest = new User({email: "test@test.com", 
                        password: "ciaociao",
                        name: "Luca", 
                        surname:"Test", 
                        birth:"01/01/1001", 
                        a_type:"629883bd16e83ec5f33247bf",
                        added_by:"629883bd16e83ec5f33247bf"
    });
    await userTest.save();
    
    paymentTest = new Payment({email: "test@test.com", 
                        amount: "999.9", 
                        description:"Prima Tassa", 
                        player:userTest._id
    });
    await paymentTest.save();

})

/* --- Close Connection to Database--- */
afterAll( async () =>{

    await Payment.deleteMany({})
    await User.deleteMany({})
    mongoose.connection.close(true);
})


describe('[SUPERTEST] [PAYMENT]  /api/v2/payment', () => {

    var token = jwt.sign({email:"dd@eclub.com"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
    header={'Content-Type':'application/json', token:token};
    console.log(header)

    /* ---  GET PAYMENTS --- */
    test('<200> GET all payments', () => {
        return request(app).get('/api/v2/payment')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    /* ---  GET SPECIFIC PAYMENT --- */
    let id = "629cd1d7c852509889761089";

    test('<200> GET specific payment', () => {
        return request(app).get('/api/v2/payment/'+paymentTest._id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    let id1 = "629cd177342fe15924cf7785";

    test('<404> GET all payments with not found id', () => {
        return request(app).get('/api/v2/payment/'+WrongId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    let id2 = "ciao";

    test('<500> GET all payments with wrong id format', () => {
        return request(app).get('/api/v2/payment/'+WrongFormatId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    /* ---  GET SPECIFIC PAYMENT by player--- */
    let id4 = "629ccffef9407f999c3b26e4"

    test('<200> GET all payments of a specific player', () => {
        return request(app).get('/api/v2/payment/player/'+userTest._id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    let id5 = "629ccffef9407f999c3b2632";

    test('<404> GET all payments with wrong id', () => {
        return request(app).get('/api/v2/payment/player/'+WrongId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    let id6 = "ciao";

    test('<500> GET all payments with wrong id format', () => {
        return request(app).get('/api/v2/payment/'+WrongFormatId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    /* --- POST PAYMENT--- */
    test('<200> POST new payment', () => {
        return request(app).post('/api/v2/payment/')
        .send({ 
                amount:"10.4", 
                description:"Test2",
                paid_at:"10/10/2020",
                player:"629b5aa922a1830d3c9df7d1"
        })
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<400> POST new payment with error in validation', () => {
        return request(app).post('/api/v2/payment/')
        .send({})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    /* --- PATCH PAYMENT--- */
    test('<200> PATCH specific payment', () => {
        return request(app).patch('/api/v2/payment/'+paymentTest._id+'/')
        .send({ 
            amount:"10.9", 
            description:"prova",
            paid_at:"10/10/2020",
            player:"629ccffef9407f999c3b26e4"
        })  
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    /* --- DELETE PAYMENT--- */
    test('<200> DELETE specific payment', () => {
        return request(app).delete('/api/v2/payment/'+paymentTest._id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });


    test('<404> DELETE specif payment with not found id', () => {
        return request(app).delete('/api/v2/payment/'+WrongId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> DELETE specif payment with wrong id format', () => {
        return request(app).delete('/api/v2/payment/'+WrongFormatId+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    


   
})
