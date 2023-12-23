const Joi = require('joi');

const categorySchema = Joi.object({
    cat_name: Joi.string().required(),
});

module.exports = categorySchema;