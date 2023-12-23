const Joi = require('joi');

const userSchema = Joi.object({
    user_name: Joi.string().required(),
});

module.exports = userSchema;