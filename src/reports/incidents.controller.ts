import {
  BadRequestException,
  Delete,
  Controller,
  Post,
  Get,
  Query,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiExcludeController,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IncidentsService } from './incidents.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@ApiExcludeController()
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body()
    createDto: {
      checkpointId: number;
      status: string;
      description: string;
    },
    @Req() req: Request & { user?: { userId?: number; sub?: number } },
  ) {
    const userId = req.user?.userId ?? req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException();
    }
    return this.incidentsService.create(createDto, userId);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.incidentsService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.incidentsService.update(+id, updateData);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.incidentsService.remove(+id);
  }
}

@ApiTags('Reporting')
@Controller('reports')
export class ReportsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @ApiOperation({ summary: 'Create a report' })
  @ApiResponse({ status: 201, description: 'Report created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid report payload' })
  @Post()
  createReport(
    @Body() dto: CreateReportDto,
    @Req() req: Request & { user?: { userId?: number; sub?: number } },
  ) {
    const authenticatedUserId = req.user?.userId ?? req.user?.sub;
    const fallbackUserId = dto.user_id;
    const resolvedUserId = authenticatedUserId ?? fallbackUserId;

    if (!resolvedUserId) {
      throw new BadRequestException('user_id is required');
    }

    return this.incidentsService.createReport(dto, Number(resolvedUserId));
  }

  @ApiOperation({ summary: 'Get all reports' })
  @ApiResponse({ status: 200, description: 'Reports returned successfully' })
  @Get()
  findAllReports() {
    return this.incidentsService.findAllReports();
  }

  @ApiOperation({ summary: 'Get a report by ID' })
  @ApiResponse({ status: 200, description: 'Report returned successfully' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  @Get(':id')
  findReportById(@Param('id') id: string) {
    return this.incidentsService.findReportById(+id);
  }

  @ApiOperation({ summary: 'Update a report' })
  @ApiResponse({ status: 200, description: 'Report updated successfully' })
  @Patch(':id')
  updateReport(@Param('id') id: string, @Body() dto: UpdateReportDto) {
    return this.incidentsService.updateReport(+id, dto);
  }

  @ApiOperation({ summary: 'Delete a report' })
  @ApiResponse({ status: 200, description: 'Report deleted successfully' })
  @Delete(':id')
  removeReport(@Param('id') id: string) {
    return this.incidentsService.removeReport(+id);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Approve a report' })
  @ApiResponse({ status: 200, description: 'Report approved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Patch(':id/approve')
  approveReport(
    @Param('id') id: string,
    @Req() req: Request & { user?: { userId?: number; sub?: number } },
  ) {
    const userId = req.user?.userId ?? req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException();
    }

    return this.incidentsService.approveReport(+id, userId);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Reject a report' })
  @ApiResponse({ status: 200, description: 'Report rejected successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Patch(':id/reject')
  rejectReport(
    @Param('id') id: string,
    @Req() req: Request & { user?: { userId?: number; sub?: number } },
  ) {
    const userId = req.user?.userId ?? req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException();
    }

    return this.incidentsService.rejectReport(+id, userId);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get moderation logs for a report' })
  @ApiResponse({ status: 200, description: 'Moderation logs returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Get(':id/logs')
  getReportLogs(@Param('id') id: string) {
    return this.incidentsService.findModerationLogs(+id);
  }
}
