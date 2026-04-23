import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateReportDto {
  @ApiPropertyOptional({
    type: String,
    example: 'Traffic obstruction',
    description: 'Updated report category',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'The obstruction has shifted closer to the checkpoint.',
    description: 'Updated report description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    type: Number,
    example: 31.769,
    description: 'Updated latitude coordinate',
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({
    type: Number,
    example: 35.2142,
    description: 'Updated longitude coordinate',
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}