const Joi = require('@hapi/joi');

/* --- VALIDATION: registration user schema --- */
const registerUserValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .min(3)
            .max(255)
            .required(),
        password: Joi.string()
            .min(6)
            .max(1024)
            .required(),
        name: Joi.string()
            .max(255)
            .required(),
        birth: Joi.date(),
        surname: Joi.string()
            .max(255)
            .required(),
        a_type: Joi.string()
            .required(),
        id_team: Joi.string(),
        zip: Joi.string()
            .max(20),
        city: Joi.string()
            .max(255),
        province: Joi.string()
            .max(255),
        nation: Joi.string()
            .max(255),
        street: Joi.string()
            .max(255),
        phone: Joi.string()
            .max(30),
        added_by: Joi.string()
            .required(),
        team_id:Joi.string()
    });
    return schema.validate(data);
}

/* --- VALIDATION: login user schema --- */
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .min(3)
            .max(255)
            .required(),
        password: Joi.string()
            .min(6)
            .max(1024)
            .required(),
    });
    return schema.validate(data);
}

/* --- VALIDATION: team user schema --- */
const teamValidation = (data) => {
    const schema = Joi.object({
        category: Joi.string()
            .min(3)
            .max(255)
            .required(),
        players: Joi.string()
            .required(),
        coach: Joi.string()
            .required(),
        tm: Joi.string()
            .required(),
        added_by: Joi.string()
            .required()
    });
    return schema.validate(data);
}

/* --- VALIDATION: user type schema --- */
const userTypeValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string()
            .required(), 
        type: Joi.number()
            .required(),
    });
    return schema.validate(data);
}

/* --- VALIDATION: password reset schema --- */
const passwordResetValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .required()
            .max(255),
    });
    return schema.validate(data);
}

/* --- VALIDATION: payment schema ---*/
const paymentValidation = (data) => {
    const schema = Joi.object({
        amount: Joi.number()
            .required(),
        description: Joi.string(),
        paid_at: Joi.date()
            .required(),
        player: Joi.string()
            .required(),
    })
    return schema.validate(data);
}

/* --- VALIDATION: event schema --- */
const eventValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string()
            .min(3)
            .max(255)
            .required(),
        date: Joi.date()
            .required(),
        description: Joi.string()
            .max(255),
        teams: Joi.array()
            .required(),
        e_type: Joi.string()
            .required(),
        added_by: Joi.string()
            .required()
    });
    return schema.validate(data);
}

/* --- VALIDATION: event type schema --- */
const eventTypeValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string()
            .required(), 
        type: Joi.number()
            .required(),
    });
    return schema.validate(data);
}

/* --- ATTENDANCE: event type schema --- */
const attendanceValidation = (data) => {
    const schema = Joi.object({
        player: Joi.string()
            .required(), 
        event: Joi.string()
            .required(),
        value: Joi.bool()
            .required(),
        added_by: Joi.string()
            .required()
    });
    return schema.validate(data);
}

/* --- EVALUATION: event type schema --- */
const evaluationValidation = (data) => {
    const schema = Joi.object({
        player: Joi.string()
            .required(), 
        event: Joi.string()
            .required(),
        value: Joi.number()
            .max(10)
            .min(0)
            .required(),
        added_by: Joi.string()
            .required()
    });
    return schema.validate(data);
}





module.exports.registerUserValidation = registerUserValidation;
module.exports.loginValidation = loginValidation;
module.exports.teamValidation = teamValidation;
module.exports.userTypeValidation = userTypeValidation;
module.exports.passwordResetValidation = passwordResetValidation;
module.exports.paymentValidation = paymentValidation;

module.exports.eventValidation = eventValidation;
module.exports.eventTypeValidation = eventTypeValidation;
module.exports.attendanceValidation = attendanceValidation;
module.exports.evaluationValidation = evaluationValidation;
    
