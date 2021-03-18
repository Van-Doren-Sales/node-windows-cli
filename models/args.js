const Joi = require('joi');

const argsSchema = Joi.object({
  _: Joi.array(),
  install: Joi.boolean(),
  uninstall: Joi.boolean(),
  reinstall: Joi.boolean(),
}).xor('install', 'uninstall', 'reinstall');

module.exports = argsSchema;
