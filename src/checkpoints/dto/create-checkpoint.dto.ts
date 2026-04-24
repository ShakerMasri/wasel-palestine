import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateCheckpointDto {
  @ApiProperty({ example: 'Huwara Checkpoint' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Nablus - Ramallah road' })
  @IsString()
  @IsNotEmpty()
  location!: string;

  @ApiProperty({ example: 32.144321 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @ApiProperty({ example: 35.287654 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;

  @ApiProperty({ example: 'Open', required: false })
  @IsOptional()
  @IsString()
  currentStatus?: string;
}
