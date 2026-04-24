import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AvoidAreaDto } from './avoid-area.dto';

export enum RouteMode {
  FASTEST = 'fastest',
  BALANCED = 'balanced',
  SAFEST = 'safest',
}

export class EstimateRouteDto {
  @ApiProperty({ example: 32.2211 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  startLatitude!: number;

  @ApiProperty({ example: 35.2544 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  startLongitude!: number;

  @ApiProperty({ example: 31.9522 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  endLatitude!: number;

  @ApiProperty({ example: 35.2332 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  endLongitude!: number;

  @ApiPropertyOptional({ enum: RouteMode, example: RouteMode.BALANCED })
  @IsOptional()
  @IsEnum(RouteMode)
  mode?: RouteMode = RouteMode.BALANCED;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  avoidCheckpoints?: boolean = false;

  @ApiPropertyOptional({ type: [AvoidAreaDto] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => AvoidAreaDto)
  avoidAreas?: AvoidAreaDto[] = [];
}
