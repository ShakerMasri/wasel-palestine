import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ReportsModule } from './reports/reports.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Wasel Palestine API')
    .setDescription('Crowdsourced Reporting System with Mobility Features')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [ReportsModule],
  });

  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'api-json',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Running on: http://localhost:${port}/api/v1`);
}

void bootstrap();
