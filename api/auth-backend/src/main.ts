import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Use Helmet to secure HTTP headers
  app.use(helmet());
  logger.log('Helmet security headers enabled');

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true, // Allow cookies and headers
  });

  await app.listen(3000);
  logger.log('Application listening on port 3000');
}
bootstrap();
