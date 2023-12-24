const Joi = require('joi');

const recordSchema = Joi.object({
    user_id: Joi.string().required(),
    cat_id: Joi.string().required(),
    amount: Joi.number().required(),
});

module.exports = recordSchema;