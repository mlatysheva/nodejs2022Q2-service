import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { dirname, join, resolve } from 'path';
import { AppModule } from './app.module';
import { parse } from 'yaml';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { cwd } from 'process';
import { Reflector } from '@nestjs/core';

dotenv.config({ path: resolve(cwd(), '.env') });

async function bootstrap() {
  const port = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const rootDirname = dirname(__dirname);
  const DOC_API = await readFile(join(rootDirname, 'doc', 'api.yaml'), 'utf-8');
  const document = parse(DOC_API);
  SwaggerModule.setup('doc', app, document);
  await app.listen(port);
}
bootstrap();
