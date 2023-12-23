const Joi = require('joi');

const recordSchema = Joi.object({
    user_id: Joi.string().required(),
    cat_id: Joi.string().required(),
    amount: Joi.string().required(),
});

module.exports = categorySchema;