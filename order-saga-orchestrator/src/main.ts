import { envConfig } from '~configs/env.config';
envConfig.ROOT_PATH = __dirname;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.set('trust proxy', 'loopback'); // Trust requests from the loopback address

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
