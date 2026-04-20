// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
// <<<<<<< HEAD
// import { ReportsModule } from './reports/reports.module'; // 1. استيراد الموديول الجديد
// import { User } from './auth/entities/user.entity';
// import { Incident } from './reports/entities/incident.entity';
// import { Checkpoint } from './checkpoints/entities/checkpoint.entity';
// import { CheckpointHistory } from './checkpoints/entities/CheckpointHistory.entity';
// import { CheckpointsModule } from './checkpoints/checkpoints.module';
// =======
// import { RouteMobilityModule } from './route-mobility/route-mobility.module';
// import { AlertsModule } from './alerts/alerts.module';
// import { ExternalApiModule } from './external-api/external-api.module';
// >>>>>>> 2f4a113fd05e464bcbea4d4cd0e6f6d037968205

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: 'localhost',
//       port: 5433,
//       username: 'admin_wasel',
//       password: 'wasel1234',
//       database: 'wasel_palestine',
// <<<<<<< HEAD
//       entities: [User, Incident, Checkpoint, CheckpointHistory],
// =======
//       entities: [__dirname + '/**/*.entity{.ts,.js}'],
// >>>>>>> 2f4a113fd05e464bcbea4d4cd0e6f6d037968205
//       synchronize: true,
//     }),
//     CheckpointsModule,
//     AuthModule,
//     UsersModule,
// <<<<<<< HEAD
//     ReportsModule,
// =======
//     RouteMobilityModule,
//     AlertsModule,
//     ExternalApiModule,
// >>>>>>> 2f4a113fd05e464bcbea4d4cd0e6f6d037968205
//   ],
// })
// export class AppModule { }


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

// موديولات يزن (Incidents & Checkpoints)
import { ReportsModule } from './reports/reports.module';
import { CheckpointsModule } from './checkpoints/checkpoints.module';

// موديولات الفريق (Route Mobility, Alerts, External API)
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
      // استخدمنا طريقة الـ Glob pattern عشان يقرأ كل الـ Entities تلقائياً بدون تعارض
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
export class AppModule { }