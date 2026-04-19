import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from './entities/alert.entity';
import { CreateAlertDto } from './dto/create-alert.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
  ) {}

  async createSubscription(user: User, createAlertDto: CreateAlertDto) {
    const newAlert = this.alertRepository.create({
      ...createAlertDto,
      user: user,
    });
    return await this.alertRepository.save(newAlert);
  }

  async findMySubscriptions(userId: number) {
    return await this.alertRepository.find({
      where: { user: { id: userId } },
    });
  }
}