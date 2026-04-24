import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { CheckpointsModule } from './checkpoints/checkpoints.module';
import { RouteMobilityModule } from './route-mobility/route-mobility.module';
import { AlertsModule } from './alerts/alerts.module';
import { ExternalApiModule } from './external-api/external-api.module';
import { IncidentsModule } from './incidents/incidents.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: Number(configService.get<string>('THROTTLE_TTL_MS') ?? 60000),
          limit: Number(configService.get<string>('THROTTLE_LIMIT') ?? 60),
        },
      ],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') ?? 'localhost',
        port: Number(configService.get<string>('DB_PORT') ?? 5433),
        username: configService.get<string>('DB_USERNAME') ?? 'admin_wasel',
        password: configService.get<string>('DB_PASSWORD') ?? 'wasel1234',
        database: configService.get<string>('DB_NAME') ?? 'wasel_palestine',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize:
          (configService.get<string>('DB_SYNC') ?? 'true') === 'true',
      }),
    }),

    EventEmitterModule.forRoot(),

    AuthModule,
    UsersModule,
    CheckpointsModule,
    ReportsModule,
    RouteMobilityModule,
    AlertsModule,
    IncidentsModule,
    ExternalApiModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
