import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { Incident } from '../reports/entities/incident.entity';
import { Checkpoint } from '../checkpoints/entities/checkpoint.entity';
import { CheckpointHistory } from '../checkpoints/entities/CheckpointHistory.entity';

@Module({
  imports: [
    // ربط الكيانات المطلوبة للمشروع [cite: 14, 25]
    TypeOrmModule.forFeature([Incident, Checkpoint, CheckpointHistory]),
  ],
  controllers: [IncidentsController],
  providers: [IncidentsService],
  exports: [IncidentsService], // مهم جداً لمشاركة المنطق مع موديول التنبيهات [cite: 42]
})
// تأكد من وجود كلمة export هنا لحل خطأ التجميع
export class IncidentsModule {}