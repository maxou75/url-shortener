import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const DEFAULT_PORT: number = 3008;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(DEFAULT_PORT);
}

bootstrap();
