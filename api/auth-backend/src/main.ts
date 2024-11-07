import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as csurf from 'csurf';
import rateLimit from 'express-rate-limit';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Use Helmet to secure HTTP headers
  app.use(helmet());
  logger.log('Helmet security headers enabled');

  // Enable CSRF protection
  app.use(csurf());
  logger.log('CSRF protection enabled');

  // Enable rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
    }),
  );
  logger.log('Rate limiting enabled');

  await app.listen(3000);
  logger.log('Application listening on port 3000');
}
bootstrap();
