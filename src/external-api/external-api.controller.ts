import { Controller, Get, Param } from '@nestjs/common'; 
import { ExternalApiService } from './external-api.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('weather')
@Public()
export class ExternalApiController {
  constructor(private readonly apiService: ExternalApiService) {}

  @Get(':city')
  async getWeather(@Param('city') city: string) {
    return this.apiService.getWeather(city);
  }
}