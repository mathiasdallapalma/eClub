const app = require('../index');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
require("dotenv").config();

jest.setTimeout(9000);

beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await mongoose.connect(process.env.DATABASETEST_URL);
})

afterAll( () =>{
    mongoose.connection.close(true);
})

describe('[SUPERTEST] [Password Reset]  /api/v1/password_reset', () => {

    var token = jwt.sign({email:"carlo@carletto.it"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
    header={'Content-Type':'application/json', token:token};
    console.log(header);

})


