const Joi = require('joi');

const userPostSchema = Joi.object({
    user_name: Joi.string().required(),
});

const userGetSchema = Joi.object({
    user_id: Joi.string().required(),
});

module.exports = userPostSchema;
module.exports = userGetSchema;