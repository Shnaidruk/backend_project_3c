const Joi = require('joi');

const walletSchema = Joi.object({
    user_id: Joi.string().required(),
});

module.exports = walletSchema;