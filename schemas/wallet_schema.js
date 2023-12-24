const Joi = require('joi');

const walletPostSchema = Joi.object({
    user_id: Joi.string().required(),
});

const walletGetSchema = Joi.object({
    user_id: Joi.string().required(),
});

const walletRaiseSchema = Joi.object({
    user_id: Joi.string().required(),
    amount: Joi.integer().required(),

});

module.exports = walletPostSchema;
module.exports = walletGetSchema;
module.exports = walletRaiseSchema;