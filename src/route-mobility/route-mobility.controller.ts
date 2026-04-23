import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { RouteMobilityService } from './route-mobility.service';
import { CreateUserReportDto } from './dto/create-user-report.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Route Mobility')
@Controller('route-mobility')
export class RouteMobilityController {
  constructor(private readonly routeMobilityService: RouteMobilityService) {}

  @ApiOperation({ summary: 'Create a new user report' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Report created successfully.' })
  @ApiResponse({
    status: 401,
    description: 'Missing or invalid authentication.',
  })
  @Post('report')
  async create(
    @Body() createDto: CreateUserReportDto,
    @Request() req: ExpressRequest & { user?: any },
  ) {
    if (!req.user) {
      throw new UnauthorizedException('Missing authentication');
    }

    const userId = req.user.userId ?? req.user.sub ?? req.user.id;
    if (userId === undefined || userId === null) {
      throw new UnauthorizedException('Invalid token payload (no user id)');
    }

    const numericUserId = Number(userId);
    if (!Number.isFinite(numericUserId) || Number.isNaN(numericUserId)) {
      throw new UnauthorizedException('Invalid user id in token');
    }

    return await this.routeMobilityService.createReport(
      createDto,
      numericUserId,
    );
  }

  @ApiOperation({ summary: 'Get all reports' })
  @ApiResponse({
    status: 200,
    description: 'List of reports retrieved successfully.',
  })
  @Get('reports')
  async findAll() {
    return await this.routeMobilityService.getAllReports();
  }

  @ApiOperation({ summary: 'Update report status' })
  @ApiResponse({ status: 200, description: 'Status updated successfully.' })
  @Patch('report/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateReportStatusDto,
  ) {
    return await this.routeMobilityService.changeStatus(+id, updateDto.status);
  }
}
