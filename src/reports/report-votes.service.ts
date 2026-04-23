import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserReport } from './entities/user-report.entity';
import { ReportVote } from './entities/report-vote.entity';
import { User } from '../auth/entities/user.entity';
import { VoteReportDto } from './dto/vote-report.dto';

@Injectable()
export class ReportVotesService {
  constructor(
    @InjectRepository(UserReport)
    private userReportRepo: Repository<UserReport>,
    @InjectRepository(ReportVote)
    private reportVoteRepo: Repository<ReportVote>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async voteOnReport(reportId: number, userId: number, dto: VoteReportDto) {
    if (!userId) {
      throw new NotFoundException('User not found');
    }

    if (dto.vote_type !== 'upvote' && dto.vote_type !== 'downvote') {
      throw new BadRequestException('Invalid vote type');
    }

    const report = await this.userReportRepo.findOne({
      where: { id: reportId },
    });
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingVote = await this.reportVoteRepo.findOne({
      where: { report_id: reportId, user_id: userId },
    });

    if (!existingVote) {
      const vote = this.reportVoteRepo.create({
        report_id: reportId,
        user_id: userId,
        vote_type: dto.vote_type,
      });

      await this.reportVoteRepo.save(vote);

      if (dto.vote_type === 'upvote') {
        report.upvotes_count += 1;
        user.credibility_score += 1;
        await this.userRepo.save(user);
      } else {
        report.downvotes_count += 1;
      }

      await this.userReportRepo.save(report);

      return {
        message: 'Vote saved successfully',
        upvotes: report.upvotes_count,
        downvotes: report.downvotes_count,
      };
    }

    if (existingVote.vote_type === dto.vote_type) {
      return {
        message: 'You already voted with this vote type',
        upvotes: report.upvotes_count,
        downvotes: report.downvotes_count,
      };
    }

    if (existingVote.vote_type === 'upvote' && dto.vote_type === 'downvote') {
      report.upvotes_count -= 1;
      report.downvotes_count += 1;
    }

    if (existingVote.vote_type === 'downvote' && dto.vote_type === 'upvote') {
      report.downvotes_count -= 1;
      report.upvotes_count += 1;
      user.credibility_score += 1;
      await this.userRepo.save(user);
    }

    existingVote.vote_type = dto.vote_type;
    await this.reportVoteRepo.save(existingVote);
    await this.userReportRepo.save(report);

    return {
      message: 'Vote updated successfully',
      upvotes: report.upvotes_count,
      downvotes: report.downvotes_count,
    };
  }

  async getReportVotesSummary(reportId: number) {
    const report = await this.userReportRepo.findOne({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return {
      upvotes: report.upvotes_count,
      downvotes: report.downvotes_count,
    };
  }

  async removeVote(reportId: number, userId: number) {
    if (!userId) {
      throw new NotFoundException('User not found');
    }

    const report = await this.userReportRepo.findOne({
      where: { id: reportId },
    });
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingVote = await this.reportVoteRepo.findOne({
      where: { report_id: reportId, user_id: userId },
    });

    if (!existingVote) {
      return {
        message: 'No vote to remove',
        upvotes: report.upvotes_count,
        downvotes: report.downvotes_count,
      };
    }

    if (existingVote.vote_type === 'upvote') {
      report.upvotes_count -= 1;
      user.credibility_score -= 1;
      await this.userRepo.save(user);
    } else {
      report.downvotes_count -= 1;
    }

    await this.reportVoteRepo.remove(existingVote);
    await this.userReportRepo.save(report);

    return {
      message: 'Vote removed successfully',
      upvotes: report.upvotes_count,
      downvotes: report.downvotes_count,
    };
  }
}
