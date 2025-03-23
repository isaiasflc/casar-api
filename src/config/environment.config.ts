import * as Joi from 'joi';

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'homologation', 'production', 'test').required(),
  PORT: Joi.number().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
});

export default envVarsSchema;
