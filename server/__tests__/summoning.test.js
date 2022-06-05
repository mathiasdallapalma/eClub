const app = require('../index.js');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const User = require('../models/User');
const Event = require('../models/Event');
const Summoning = require('../models/Summoning');

require("dotenv").config();

/* --- Set Timeout --- */
jest.setTimeout(9000);

/* --- Connection to Database --- */
let BACKUP_USER
let BACKUP_EVENT
let BACKUP_SUMMONING

beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await mongoose.connect(process.env.DATABASE_URL);
    BACKUP_USER = await User.find({}).exec()
    BACKUP_EVENT = await Event.find({}).exec()
    BACKUP_SUMMONING = await Summoning.find({}).exec()
})

/* --- Close Connection to Database--- */
afterAll( async () =>{
    await User.deleteMany({})
    await Event.deleteMany({})
    await Summoning.deleteMany({})
    await User.insertMany(BACKUP_USER)
    await Event.insertMany(BACKUP_EVENT)
    await Summoning.insertMany(BACKUP_SUMMONING)

    mongoose.connection.close(true);
})


describe('[SUPERTEST] [SUMMONING]  /api/v2/summoning', () => {

    var token = jwt.sign({email:"dd@eclub.com"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
    header={'Content-Type':'application/json', token:token};
    console.log(header)

    /* ---  GET SUMMONING --- */
    test('<200> GET all summoning', () => {
        return request(app).get('/api/v2/summoning')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    /* ---  GET SPECIFIC SUMMONING by event--- */
    let id3 = "629b19c317d2c125ef102c69"

    test('<200> GET all summoning of a specific event', () => {
        return request(app).get('/api/v2/summoning/event/'+id3+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    let id5 = "629b19c317d2c125ef102c54";

    test('<404> GET all summoning with wrong id', () => {
        return request(app).get('/api/v2/summoning/event/'+id5+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    let id6 = "ciao";

    test('<500> GET all summoning with wrong id format', () => {
        return request(app).get('/api/v2/summoning/event/'+id2+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });

    /* ---  GET SPECIFIC SUMMONING by player--- */
    let id7 = "629ccffef9407f999c3b26e4"

    test('<200> GET all summoning of a specific player', () => {
        return request(app).get('/api/v2/summoning/player/'+id7+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    let id8 = "629ccffef9407f999c3b2632";

    test('<404> GET all summoning with wrong id', () => {
        return request(app).get('/api/v2/summoning/player/'+id8+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    let id9 = "ciao";

    test('<500> GET all summoning with wrong id format', () => {
        return request(app).get('/api/v2/summoning/player/'+id9+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });
    
    /* --- POST SUMMONING --- */
    test('<200> POST new summoning', () => {
        return request(app).post('/api/v2/summoning/')
        .send({ 
                value:"true",
                event:"629b19c317d2c125ef102c69", 
                player:"629ccffef9407f999c3b2632",
                added_by:"629ccffef9407f999c3b26e4"
        })
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    test('<400> POST new summoning with error in validation', () => {
        return request(app).post('/api/v2/payment/')
        .send({})
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(400)
    });

    /* --- PATCH summoning--- */
    let id="629b19c417d2c125ef102c6f";

    test('<200> PATCH specific summoning', () => {
        return request(app).patch('/api/v2/summoning/'+id+'/')
        .send({ 
            value:"0"
        })  
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    /* --- DELETE PAYMENT--- */
    test('<200> DELETE specific summoning', () => {
        return request(app).delete('/api/v2/summoning/'+id+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(200)
    });

    let id4="629b19c417d2c125ef102c32";

    test('<404> DELETE specific summoning with not found id', () => {
        return request(app).delete('/api/v2/payment/'+id4+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(404)
    });

    let id2="ciaociao";

    test('<500> DELETE specif payment with wrong id format', () => {
        return request(app).delete('/api/v2/payment/'+id2+'/')
        .set('auth-token', token).set('Accept', 'application/json')
        .expect(500)
    });
   
})
