import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { CheckpointsModule } from './checkpoints/checkpoints.module';
import { RouteMobilityModule } from './route-mobility/route-mobility.module';
import { AlertsModule } from './alerts/alerts.module';
import { ExternalApiModule } from './external-api/external-api.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'admin_wasel',
      password: 'wasel1234',
      database: 'wasel_palestine',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    CheckpointsModule,
    ReportsModule,
    RouteMobilityModule,
    AlertsModule,
    ExternalApiModule,
  ],
})
export class AppModule {}
