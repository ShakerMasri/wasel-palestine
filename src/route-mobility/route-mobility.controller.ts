import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EstimateRouteDto } from './dto/estimate-route.dto';
import { RouteMobilityService } from './route-mobility.service';

@ApiTags('Route Mobility')
@Controller('route-mobility')
export class RouteMobilityController {
  constructor(private readonly routeMobilityService: RouteMobilityService) {}

  @Post('estimate')
  @ApiOperation({
    summary: 'Estimate a route between two locations',
  })
  @ApiBody({ type: EstimateRouteDto })
  @ApiResponse({
    status: 200,
    description: 'Estimated route returned successfully',
  })
  async estimateRoute(@Body() dto: EstimateRouteDto) {
    return await this.routeMobilityService.estimateRoute(dto);
  }
}
