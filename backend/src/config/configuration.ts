import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3001),
  DATABASE_URL: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('30d'),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
  REDIS_URL: Joi.string().optional(),
  S3_ENDPOINT: Joi.string().optional(),
  S3_ACCESS_KEY: Joi.string().optional(),
  S3_SECRET_KEY: Joi.string().optional(),
  S3_BUCKET: Joi.string().optional(),
  S3_PUBLIC_URL: Joi.string().optional(),
});

export default () => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  s3: {
    endpoint: process.env.S3_ENDPOINT,
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
    bucket: process.env.S3_BUCKET,
    publicUrl: process.env.S3_PUBLIC_URL,
  },
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  FRONTEND_URL: process.env.FRONTEND_URL,
});
