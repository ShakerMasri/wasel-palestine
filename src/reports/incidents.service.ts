import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './entities/incident.entity';
import { UserReport } from './entities/user-report.entity';
import { Checkpoint } from '../checkpoints/entities/checkpoint.entity';
import { CheckpointHistory } from '../checkpoints/entities/CheckpointHistory.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident) private incidentRepo: Repository<Incident>,
    @InjectRepository(UserReport)
    private userReportRepo: Repository<UserReport>,
    @InjectRepository(Checkpoint)
    private checkpointRepo: Repository<Checkpoint>,
    @InjectRepository(CheckpointHistory)
    private historyRepo: Repository<CheckpointHistory>,
  ) {}

  async create(data: any, userId: number) {
    // استقبلنا الـ userId هون
    await this.checkpointRepo.update(data.checkpointId, {
      currentStatus: data.status,
    });

    await this.historyRepo.save({
      checkpointId: data.checkpointId,
      status: data.status,
      userId: userId,
      note: data.description,
    });

    return await this.incidentRepo.save({
      description: data.description,
      checkpointId: data.checkpointId,
      userId: userId,
      type: data.status,
      severity: 'Normal',
    });
  }

  async findAll(query: any) {
    const {
      type,
      severity,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'DESC',
    } = query;

    const [items, total] = await this.incidentRepo.findAndCount({
      where: {
        type: type ? type : undefined,
        severity: severity ? severity : undefined,
      },
      order: {
        [sortBy]: order.toUpperCase(),
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: items,
      meta: {
        total,
        page: Number(page),
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async update(id: number, updateData: any) {
    const incident = await this.incidentRepo.findOne({ where: { id } });
    if (!incident) {
      throw new Error('البلاغ غير موجود');
    }

    Object.assign(incident, updateData);

    return await this.incidentRepo.save(incident);
  }

  async remove(id: number) {
    const incident = await this.incidentRepo.findOne({ where: { id } });

    if (!incident) {
      throw new Error('عفواً، هاد البلاغ مش موجود أصلاً عشان أحذفه!');
    }

    await this.incidentRepo.remove(incident);

    return {
      message: `تم حذف البلاغ رقم ${id} بنجاح من النظام`,
      deletedId: id,
    };
  }

  async createReport(dto: CreateReportDto) {
    const report = this.userReportRepo.create(dto);
    return await this.userReportRepo.save(report);
  }

  async findAllReports() {
    return await this.userReportRepo.find();
  }

  async findReportById(id: number) {
    const report = await this.userReportRepo.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }

  async updateReport(id: number, dto: UpdateReportDto) {
    const report = await this.userReportRepo.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (dto.category !== undefined) {
      report.category = dto.category;
    }

    if (dto.description !== undefined) {
      report.description = dto.description;
    }

    if (dto.latitude !== undefined) {
      report.latitude = dto.latitude;
    }

    if (dto.longitude !== undefined) {
      report.longitude = dto.longitude;
    }

    return await this.userReportRepo.save(report);
  }

  async removeReport(id: number) {
    const report = await this.userReportRepo.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    await this.userReportRepo.remove(report);

    return {
      message: `تم حذف البلاغ رقم ${id} بنجاح من النظام`,
      deletedId: id,
    };
  }
}
