import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CheckpointsService } from './checkpoints.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateCheckpointDto } from './dto/create-checkpoint.dto';
import { UpdateCheckpointDto } from './dto/update-checkpoint.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Checkpoints')
@Controller('checkpoints')
export class CheckpointsController {
  constructor(private readonly checkpointsService: CheckpointsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a checkpoint' })
  @ApiResponse({ status: 201, description: 'Checkpoint created successfully' })
  create(@Body() createDto: CreateCheckpointDto) {
    return this.checkpointsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all checkpoints' })
  findAll() {
    return this.checkpointsService.findAll();
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a checkpoint' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCheckpointDto,
  ) {
    return this.checkpointsService.update(id, updateDto);
  }
}
