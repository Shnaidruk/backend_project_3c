const Joi = require('joi');

const walletPostSchema = Joi.object({
    user_id: Joi.string().required(),
});

const walletGetSchema = Joi.object({
    user_id: Joi.string().required(),
});

const walletRaiseSchema = Joi.object({
    user_id: Joi.string().required(),
    amount: Joi.number().required(),

});

module.exports = {walletPostSchema, walletGetSchema, walletRaiseSchema};
