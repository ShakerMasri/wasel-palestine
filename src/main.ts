import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// استيراد الموديولات للتأكد من شمولها في السواجر
import { ReportsModule } from './reports/reports.module';
import { CheckpointsModule } from './checkpoints/checkpoints.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. البادئة العامة لجميع الروابط
  app.setGlobalPrefix('api/v1');

  // 2. تفعيل الحماية والتحقق من البيانات (Validation)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true // مهم لتحويل الأنواع تلقائياً (مثل string لـ number)
    }),
  );

  // 3. إعدادات السواجر الاحترافية
  const config = new DocumentBuilder()
    .setTitle('Wasel Palestine API')
    .setDescription('Crowdsourced Reporting System: Incidents & Checkpoints Management')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addTag('Reports', 'Operations related to incident reporting')
    .addTag('Checkpoints', 'Operations related to checkpoint management')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [ReportsModule, CheckpointsModule], // شمول الجزئيتين معاً
  });

  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'api-json',
    swaggerOptions: { persistAuthorization: true },
  });

  // 4. تشغيل السيرفر
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`\n✅ Project is live: http://localhost:${port}/api/v1`);
  console.log(`📖 Swagger UI: http://localhost:${port}/api\n`);
}

void bootstrap();