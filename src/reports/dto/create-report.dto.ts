import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiPropertyOptional({
    type: Number,
    example: 12,
    description: 'Optional authenticated or fallback user ID',
  })
  @IsOptional()
  @IsNumber()
  user_id!: number;

  @ApiProperty({
    type: String,
    example: 'Road obstruction',
    description: 'Report category',
  })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiProperty({
    type: String,
    example: 'A fallen barrier is blocking the main road.',
    description: 'Detailed report description',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(1000)
  description!: string;

  @ApiProperty({
    type: Number,
    example: 31.7683,
    description: 'Latitude coordinate',
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @ApiProperty({
    type: Number,
    example: 35.2137,
    description: 'Longitude coordinate',
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(-180)
  @Max(180)
  longitude!: number;

  // --- جزئية الـ Checkpoint & Incident (الإضافات) ---

  @ApiPropertyOptional({
    type: Number,
    example: 5,
    description: 'ID of the checkpoint this report is related to',
  })
  @IsOptional()
  @IsNumber()
  checkpoint_id?: number;

  @ApiPropertyOptional({
    type: String,
    example: 'Major Incident',
    description: 'Severity or specific incident type',
  })
  @IsOptional()
  @IsString()
  incident_type?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Active',
    description: 'Status of the incident/checkpoint reported',
  })
  @IsOptional()
  @IsString()
  status?: string;
}