import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { VoteReportDto } from './dto/vote-report.dto';
import { ReportVotesService } from './report-votes.service';

@Controller('reports')
export class ReportVotesController {
  constructor(private readonly reportVotesService: ReportVotesService) {}

  @UseGuards(AuthGuard)
  @Post(':id/vote')
  voteOnReport(
    @Param('id') id: string,
    @Req() req: Request & { user?: { userId?: number; sub?: number } },
    @Body() dto: VoteReportDto,
  ) {
    const userId = req.user?.userId ?? req.user?.sub;
    return this.reportVotesService.voteOnReport(+id, Number(userId), dto);
  }

  @UseGuards(AuthGuard)
  @Get(':id/votes')
  getReportVotes(@Param('id') id: string) {
    return this.reportVotesService.getReportVotesSummary(+id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id/vote')
  removeVote(
    @Param('id') id: string,
    @Req() req: Request & { user?: { userId?: number; sub?: number } },
  ) {
    const userId = req.user?.userId ?? req.user?.sub;
    return this.reportVotesService.removeVote(+id, Number(userId));
  }
}
