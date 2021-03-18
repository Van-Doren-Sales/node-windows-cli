const Joi = require('joi');

const servicercSchema = Joi.object({
  service: Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    script: Joi.string(),
    env: Joi.string(),
  }).required(),
});

module.exports = servicercSchema;
