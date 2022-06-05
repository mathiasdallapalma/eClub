const app = require('../index');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const User = require('../models/User');
const Team = require('../models/Team');
const Payment = require('../models/Payment');

require("dotenv").config();

/* --- Set Timeout --- */
jest.setTimeout(9000);

/* --- Connection to Database --- */
let BACKUP_USER
let BACKUP_TEAM
let BACKUP_PAYMENT

beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await mongoose.connect(process.env.DATABASE_URL);
    BACKUP_USER = await User.find({}).exec()
    BACKUP_TEAM = await Team.find({}).exec()
    BACKUP_PAYMENT = await Payment.find({}).exec()
})

/* --- Close Connection to Database--- */
afterAll( async () =>{
    await User.deleteMany({})
    await Team.deleteMany({})
    await Payment.deleteMany({})
    await User.insertMany(BACKUP_USER)
    await Team.insertMany(BACKUP_TEAM)
    await Payment.insertMany(BACKUP_PAYMENT)


    mongoose.connection.close(true);
})


describe('[SUPERTEST] [PAYMENT]  /api/v2/payment', () => {

    var token = jwt.sign({email:"giovanni@storti.it"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
    header={'Content-Type':'application/json', token:token};
    console.log(header)

    /* ---  GET PAYMENTS --- */
    test('<200> GET all payments', () => {
        return request(app).get('/api/v2/payment')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    // test('<500> GET all payments with server error', () => {
    //     return request(app).get('/api/v2/payment/')
    //     .set('auth-token', token).set('Accept', 'application/json')
    //     .expect(500)
    // });


    /* ---  GET SPECIFIC PAYMENT --- */
    let id = "629cd177342fe15924cf7771";

    test('<200> GET specific payment', () => {
        return request(app).get('/api/v2/payment/'+id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    let id1 = "629cd177342fe15924cf7785";

    test('<404> GET all payments with not found id', () => {
        return request(app).get('/api/v2/payment/'+id1+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    let id2 = "ciao";

    test('<500> GET all payments with wrong id format', () => {
        return request(app).get('/api/v2/payment/'+id2+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    /* ---  GET SPECIFIC PAYMENT by player--- */
    let id4 = "629ccffef9407f999c3b26e4"

    test('<200> GET all payments of a specific player', () => {
        return request(app).get('/api/v2/payment/player/'+id4+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    let id5 = "629ccffef9407f999c3b2632";

    test('<404> GET all payments with wrong id', () => {
        return request(app).get('/api/v2/payment/player/'+id5+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    let id6 = "ciao";

    test('<500> GET all payments with wrong id format', () => {
        return request(app).get('/api/v2/payment/'+id2+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    /* --- POST PAYMENT--- */
    test('<200> POST new payment', () => {
        return request(app).post('/api/v2/payment/')
        .send({ 
                amount:"10.4", 
                description:"Mathias DallaLampada",
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
        return request(app).patch('/api/v2/payment/'+id+'/')
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
        return request(app).delete('/api/v2/payment/'+id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });


    test('<404> DELETE specif payment with not found id', () => {
        return request(app).delete('/api/v2/payment/'+id4+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    test('<500> DELETE specif payment with wrong id format', () => {
        return request(app).delete('/api/v2/payment/'+id2+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    


   
})
