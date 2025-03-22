import * as Joi from 'joi';

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'homologation', 'production', 'test').required(),
  PORT: Joi.number().required(),
});

export default envVarsSchema;
