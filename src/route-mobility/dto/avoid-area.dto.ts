import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class AvoidAreaDto {
  @ApiPropertyOptional({ example: 'Avoided block' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 32.05 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  minLatitude!: number;

  @ApiProperty({ example: 32.15 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  maxLatitude!: number;

  @ApiProperty({ example: 35.2 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  minLongitude!: number;

  @ApiProperty({ example: 35.3 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  maxLongitude!: number;
}
