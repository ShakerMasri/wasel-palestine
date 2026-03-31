import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CheckpointsModule } from './checkpoints/checkpoints.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'wasel_palestine',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    CheckpointsModule,
    ReportsModule,
  ],
})
export class AppModule {}
