import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { CheckpointsService } from './checkpoints.service';
import { AuthGuard } from '../auth/auth.guard';
// إضافة الـ Imports الخاصة بالسواجر
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCheckpointDto } from './dto/create-checkpoint.dto'; // تأكد من المسار

@ApiTags('Checkpoints') // عشان يظهر بقسم منفصل في السواجر
@Controller('checkpoints')
export class CheckpointsController {
    constructor(private readonly checkpointsService: CheckpointsService) { }

    @ApiBearerAuth('access-token') // عشان يظهر قفل الحماية للـ Token
    @ApiOperation({ summary: 'إنشاء حاجز جديد' }) // وصف العملية
    @ApiResponse({ status: 201, description: 'تم إنشاء الحاجز بنجاح.' })
    @Post()
    @UseGuards(AuthGuard)
    create(@Body() createDto: CreateCheckpointDto) { // غيرنا النوع لـ DTO عشان السواجر يقرأ الحقول
        return this.checkpointsService.create(createDto);
    }

    @ApiOperation({ summary: 'جلب قائمة جميع الحواجز' })
    @ApiResponse({ status: 200, description: 'تم جلب البيانات بنجاح.' })
    @Get()
    findAll() {
        return this.checkpointsService.findAll();
    }
}