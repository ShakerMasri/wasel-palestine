

import { Delete, Controller, Post, Get, Query, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { AuthGuard } from '../auth/auth.guard'; // تأكد إن الـ import موجود

@Controller('incidents')
export class IncidentsController {
    constructor(private readonly incidentsService: IncidentsService) { }

    @UseGuards(AuthGuard)
    @Post()
    create(@Body() createDto: any, @Req() req: any) {
        const userId = req.user.userId; // لازم هاي تكون موجودة
        return this.incidentsService.create(createDto, userId);
    }

    @Get()
    findAll(@Query() query: any) {
        return this.incidentsService.findAll(query);
    }

    @UseGuards(AuthGuard) // رجّعنا الحماية هون كمان
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateData: any) {
        return this.incidentsService.update(+id, updateData);
    }

    @UseGuards(AuthGuard) // رجّعنا الحماية هون كمان
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.incidentsService.remove(+id);
    }

    @Get('stats/summary')
    getStats() {
        return this.incidentsService.getStats();
    }

}