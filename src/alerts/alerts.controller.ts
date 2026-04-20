import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { AuthGuard } from '../auth/auth.guard'; 

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @UseGuards(AuthGuard) 
  @Post('subscribe')
  async subscribe(@Request() req, @Body() createAlertDto: CreateAlertDto) {
    const userId = req.user.sub || req.user.userId || req.user.id;
    
    return this.alertsService.createSubscription({ id: userId } as any, createAlertDto);
  }

  @UseGuards(AuthGuard)
  @Get('my-subscriptions')
  async getMyAlerts(@Request() req) {
    const userId = req.user.sub || req.user.userId || req.user.id;
    return this.alertsService.findMySubscriptions(userId);
  }
}