import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ExternalApiService } from './external-api.service';
import { ExternalApiController } from './external-api.controller';

@Module({
  imports: [
    ConfigModule,

    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        timeout: Number(
          configService.get<string>('EXTERNAL_API_TIMEOUT_MS') ?? 5000,
        ),
        maxRedirects: 3,
      }),
    }),

    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: Number(
          configService.get<string>('WEATHER_CACHE_TTL_MS') ?? 1800000,
        ),
        max: 100,
      }),
    }),
  ],
  controllers: [ExternalApiController],
  providers: [ExternalApiService],
  exports: [ExternalApiService],
})
export class ExternalApiModule {}
