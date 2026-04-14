import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './entities/incident.entity';
import { ReportVote } from './entities/report-vote.entity';
import { ModerationLog } from './entities/moderation-log.entity';
import { UserReport } from './entities/user-report.entity';
import { User } from '../auth/entities/user.entity';
import { Checkpoint } from '../checkpoints/entities/checkpoint.entity';
import { CheckpointHistory } from '../checkpoints/entities/CheckpointHistory.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportVotesService } from './report-votes.service';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident) private incidentRepo: Repository<Incident>,
    @InjectRepository(UserReport)
    private userReportRepo: Repository<UserReport>,
    @InjectRepository(ReportVote)
    private reportVoteRepo: Repository<ReportVote>,
    @InjectRepository(ModerationLog)
    private moderationLogRepo: Repository<ModerationLog>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Checkpoint)
    private checkpointRepo: Repository<Checkpoint>,
    @InjectRepository(CheckpointHistory)
    private historyRepo: Repository<CheckpointHistory>,
    private readonly reportVotesService: ReportVotesService,
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

  async createReport(dto: CreateReportDto, userId: number) {
    const category = dto.category?.trim();
    const description = dto.description?.trim();

    if (!category) {
      throw new BadRequestException('category is required');
    }

    if (!description) {
      throw new BadRequestException('description is required');
    }

    if (description.length < 5 || description.length > 1000) {
      throw new BadRequestException(
        'description must be between 5 and 1000 characters',
      );
    }

    if (dto.latitude < -90 || dto.latitude > 90) {
      throw new BadRequestException('latitude must be between -90 and 90');
    }

    if (dto.longitude < -180 || dto.longitude > 180) {
      throw new BadRequestException('longitude must be between -180 and 180');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const recentReportsCount = await this.userReportRepo
      .createQueryBuilder('report')
      .where('report.user_id = :userId', { userId })
      .andWhere("report.timestamp >= NOW() - INTERVAL '5 minutes'")
      .getCount();

    if (recentReportsCount >= 3) {
      throw new HttpException(
        'Too many reports created in a short time window',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const candidateReports = await this.userReportRepo
      .createQueryBuilder('report')
      .where('report.category = :category', { category })
      .andWhere('report.description = :description', { description })
      .andWhere(
        'ABS(report.latitude - :latitude) < 0.001 AND ABS(report.longitude - :longitude) < 0.001',
        {
          latitude: dto.latitude,
          longitude: dto.longitude,
        },
      )
      .getMany();

    const duplicateReport = candidateReports[0];

    if (duplicateReport) {
      const existingVote = await this.reportVoteRepo.findOne({
        where: { report_id: duplicateReport.id, user_id: userId },
      });

      if (existingVote) {
        return {
          message: 'Already voted',
          report_id: duplicateReport.id,
        };
      }

      const voteResult = await this.reportVotesService.voteOnReport(
        duplicateReport.id,
        userId,
        { vote_type: 'upvote' },
      );

      return {
        message: 'Similar report already exists, upvoted',
        report_id: duplicateReport.id,
        upvotes: voteResult.upvotes,
      };
    }

    const report = this.userReportRepo.create({
      user_id: userId,
      category,
      description,
      latitude: dto.latitude,
      longitude: dto.longitude,
    });
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

  private async ensureAdmin(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'Admin') {
      throw new ForbiddenException('Admin access required');
    }
  }

  async approveReport(id: number, userId: number) {
    await this.ensureAdmin(userId);

    const report = await this.userReportRepo.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (report.status === 'duplicate') {
      throw new BadRequestException('Cannot approve duplicate report');
    }

    if (report.status !== 'pending') {
      return {
        message: `Report already ${report.status}`,
      };
    }

    report.status = 'approved';
    await this.userReportRepo.save(report);

    await this.moderationLogRepo.save({
      admin_id: userId,
      report_id: report.id,
      action: 'approve',
    });

    return {
      message: 'Report approved',
    };
  }

  async rejectReport(id: number, userId: number) {
    await this.ensureAdmin(userId);

    const report = await this.userReportRepo.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (report.status === 'duplicate') {
      report.status = 'rejected';
      await this.userReportRepo.save(report);

      await this.moderationLogRepo.save({
        admin_id: userId,
        report_id: report.id,
        action: 'reject',
      });

      return {
        message: 'Report rejected',
      };
    }

    if (report.status !== 'pending') {
      return {
        message: `Report already ${report.status}`,
      };
    }

    report.status = 'rejected';
    await this.userReportRepo.save(report);

    await this.moderationLogRepo.save({
      admin_id: userId,
      report_id: report.id,
      action: 'reject',
    });

    return {
      message: 'Report rejected',
    };
  }

  async findModerationLogs(reportId: number) {
    return await this.moderationLogRepo.find({
      where: { report_id: reportId },
      order: { created_at: 'DESC' },
      select: {
        admin_id: true,
        action: true,
        created_at: true,
      },
    });
  }
}
