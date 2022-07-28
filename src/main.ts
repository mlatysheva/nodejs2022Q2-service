import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
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
  const DOC_API = await readFile(
    resolve(process.cwd(), 'doc', 'api.yaml'),
    'utf8',
  );
  const document = parse(DOC_API);

  SwaggerModule.setup('doc', app, document);
  console.log(`Server running on port ${port}`);
  await app.listen(port);
}
bootstrap();
