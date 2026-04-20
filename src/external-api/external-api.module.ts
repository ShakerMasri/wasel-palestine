import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { ExternalApiService } from './external-api.service';
import { ExternalApiController } from './external-api.controller'; // 1. تأكد من استيراد الـ Controller

@Module({
  imports: [
    HttpModule,
    CacheModule.register({
      ttl: 1800000,
      max: 100,
    }),
  ],
  controllers: [ExternalApiController], // 2. أضف هذا السطر هنا لتفعيل الروابط
  providers: [ExternalApiService],
  exports: [ExternalApiService], 
})
export class ExternalApiModule {}