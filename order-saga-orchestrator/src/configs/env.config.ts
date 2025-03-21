import 'dotenv/config';

const isTest = process.env.NODE_ENV === 'test';

export const envConfig = {
  ROOT_PATH: process.cwd() + (isTest ? '/src' : ''),
  IS_TEST: isTest,
  DATABASE: {
    CONNECT: process.env.DATABASE_CONNECT as any,
    HOST: process.env.DATABASE_HOST,
    PORT: Number(process.env.DATABASE_PORT),
    USER: process.env.DATABASE_USER,
    PASSWORD: process.env.DATABASE_PASSWORD,
    NAME: process.env.DATABASE_NAME,
    SSL: process.env.DATABASE_SSL === 'true',
  },
  JWT: {
    SECRET: process.env.JWT_SECRET || 'secret',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  },
  YOUTUBE: {
    API_KEY: process.env.YOUTUBE_API_KEY,
  },
};
