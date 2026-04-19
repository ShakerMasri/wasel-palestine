import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserReport } from './entities/user-report.entity';
import { CreateUserReportDto } from './dto/create-user-report.dto';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

@Injectable()
export class RouteMobilityService {
  constructor(
    @InjectRepository(UserReport)
    private readonly reportRepository: Repository<UserReport>,
  ) {}

  async createReport(createDto: CreateUserReportDto, userId: number) {
    const newReport = this.reportRepository.create({
      ...createDto,
      user: { id: userId },
    });

    return await this.reportRepository.save(newReport);
  }
  // داخل route-mobility.service.ts

  async changeStatus(id: number, newStatus: string): Promise<UserReport> {
    const report = await this.reportRepository.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException(`Report number ${id} does not exist`);
    }

    report.status = newStatus;

    return await this.reportRepository.save(report);
  }

  async getAllReports() {
    return await this.reportRepository.find({
      relations: ['user'],
      order: { timestamp: 'DESC' },
    });
  }
}
