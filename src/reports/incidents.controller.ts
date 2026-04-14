import {
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
} from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createDto: any, @Req() req: any) {
    const userId = req.user.userId;
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
  createReport(@Body() dto: CreateReportDto) {
    return this.incidentsService.createReport(dto);
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
}
