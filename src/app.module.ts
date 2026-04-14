import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module'; // 1. استيراد الموديول الجديد
import { User } from './auth/entities/user.entity';
import { Incident } from './reports/entities/incident.entity';
import { UserReport } from './reports/entities/user-report.entity';
import { Checkpoint } from './checkpoints/entities/checkpoint.entity';
import { CheckpointHistory } from './checkpoints/entities/CheckpointHistory.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'admin_wasel',
      password: 'wasel1234',
      database: 'wasel_palestine',
      entities: [User, Incident, Checkpoint, CheckpointHistory, UserReport],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ReportsModule,
  ],
})
export class AppModule {}
