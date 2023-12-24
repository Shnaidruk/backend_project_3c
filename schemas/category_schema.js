const Joi = require('joi');

const categoryPostSchema = Joi.object({
    cat_name: Joi.string().required(),
});

const categoryGetSchema = Joi.object({
    cat_Id: Joi.string().required(),
});

module.exports = {categoryPostSchema, categoryGetSchema};
