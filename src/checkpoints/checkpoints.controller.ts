import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { CheckpointsService } from './checkpoints.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('checkpoints')
export class CheckpointsController {
    constructor(private readonly checkpointsService: CheckpointsService) { }

    @Post()
    @UseGuards(AuthGuard)
    create(@Body() createDto: any) {
        return this.checkpointsService.create(createDto);
    }

    @Get()
    findAll() {
        return this.checkpointsService.findAll();
    }
}