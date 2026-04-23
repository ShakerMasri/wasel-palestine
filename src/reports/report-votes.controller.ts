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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Reporting')
@Controller('reports')
export class ReportVotesController {
  constructor(private readonly reportVotesService: ReportVotesService) {}

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Vote on a report' })
  @ApiResponse({ status: 201, description: 'Vote recorded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get report vote summary' })
  @ApiResponse({ status: 200, description: 'Vote summary returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Get(':id/votes')
  getReportVotes(@Param('id') id: string) {
    return this.reportVotesService.getReportVotesSummary(+id);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Remove a report vote' })
  @ApiResponse({ status: 200, description: 'Vote removed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
