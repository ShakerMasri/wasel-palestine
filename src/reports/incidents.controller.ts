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
import { IncidentsService } from './incidents.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
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

@Controller('reports')
export class ReportsController {
  constructor(private readonly incidentsService: IncidentsService) {}

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

  @Get()
  findAllReports() {
    return this.incidentsService.findAllReports();
  }

  @Get(':id')
  findReportById(@Param('id') id: string) {
    return this.incidentsService.findReportById(+id);
  }

  @Patch(':id')
  updateReport(@Param('id') id: string, @Body() dto: UpdateReportDto) {
    return this.incidentsService.updateReport(+id, dto);
  }

  @Delete(':id')
  removeReport(@Param('id') id: string) {
    return this.incidentsService.removeReport(+id);
  }

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

  @UseGuards(AuthGuard)
  @Get(':id/logs')
  getReportLogs(@Param('id') id: string) {
    return this.incidentsService.findModerationLogs(+id);
  }
}
