import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { Alert } from './entities/alert.entity';
import { AlertRecord } from './entities/alert-record.entity';
import { CreateAlertDto } from './dto/create-alert.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    @InjectRepository(AlertRecord)
    private readonly alertRecordRepository: Repository<AlertRecord>,
  ) {}

  async createSubscription(user: User, createAlertDto: CreateAlertDto) {
    const newAlert = this.alertRepository.create({ ...createAlertDto, user });
    return await this.alertRepository.save(newAlert);
  }

  async findMySubscriptions(userId: number) {
    return await this.alertRepository.find({ where: { user: { id: userId } } });
  }

  @OnEvent('incident.verified')
  async handleIncidentEvent(payload: { region: string; category: string; description: string }) {
    this.logger.log(`Matching subscribers for region: ${payload.region}`);

    const subscriptions = await this.alertRepository.find({
      where: { region: payload.region, category: payload.category, isActive: true },
      relations: ['user'],
    });

    const records = subscriptions.map(sub => 
      this.alertRecordRepository.create({
        user: sub.user,
        message: `تنبيه جديد في ${payload.region}: ${payload.description}`,
      })
    );

    if (records.length > 0) {
      await this.alertRecordRepository.save(records);
      this.logger.log(`${records.length} alerts created.`);
    }
  }
}