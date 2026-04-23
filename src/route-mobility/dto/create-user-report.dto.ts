import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserReportDto {
  @ApiProperty({
    example: 'Traffic',
    description: 'The category of the report',
  })
  @IsString({ message: 'Category must be a string' })
  @IsNotEmpty({ message: 'Category is required' })
  category!: string;

  @ApiProperty({
    example: 'Accident on main street',
    description: 'Detailed description',
  })
  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description!: string;

  @ApiProperty({ example: 32.2211, description: 'Latitude coordinate' })
  @IsNumber({}, { message: 'Latitude must be a number' })
  @Min(-90)
  @Max(90)
  latitude!: number;

  @ApiProperty({ example: 35.2332, description: 'Longitude coordinate' })
  @IsNumber({}, { message: 'Longitude must be a number' })
  @Min(-180)
  @Max(180)
  longitude!: number;
}
