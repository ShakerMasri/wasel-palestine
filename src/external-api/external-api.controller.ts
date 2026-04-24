import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ExternalApiService } from './external-api.service';
import { Public } from '../auth/decorators/public.decorator';
import { EstimateRouteDto } from '../route-mobility/dto/estimate-route.dto';

@ApiTags('External APIs')
@Controller()
@Public()
export class ExternalApiController {
  constructor(private readonly apiService: ExternalApiService) {}

  @Get('weather/:city')
  @ApiOperation({
    summary: 'Get weather data for a city',
  })
  @ApiResponse({
    status: 200,
    description: 'Weather data returned successfully',
  })
  async getWeatherLegacy(@Param('city') city: string) {
    return this.apiService.getWeather(city);
  }

  @Get('external-api/weather/:city')
  @ApiOperation({
    summary: 'Get weather data for a city',
  })
  @ApiResponse({
    status: 200,
    description: 'Weather data returned successfully',
  })
  async getWeather(@Param('city') city: string) {
    return this.apiService.getWeather(city);
  }

  @Post('external-api/routing/estimate')
  @ApiOperation({
    summary: 'Get external routing estimate from OpenRouteService',
  })
  @ApiBody({ type: EstimateRouteDto })
  @ApiResponse({
    status: 200,
    description: 'External routing estimate returned successfully',
  })
  async estimateExternalRoute(@Body() dto: EstimateRouteDto) {
    return this.apiService.getDrivingRoute(
      {
        latitude: dto.startLatitude,
        longitude: dto.startLongitude,
      },
      {
        latitude: dto.endLatitude,
        longitude: dto.endLongitude,
      },
      true,
    );
  }
}
