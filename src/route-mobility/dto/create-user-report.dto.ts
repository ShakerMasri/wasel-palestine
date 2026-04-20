import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateUserReportDto {
  @IsString({ message: 'Category must be a string' })
  @IsNotEmpty({ message: 'Category is required' })
  category!: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description!: string;

  @IsNumber({}, { message: 'Latitude must be a number' })
  @Min(-90)
  @Max(90)
  latitude!: number;

  @IsNumber({}, { message: 'Longitude must be a number' })
  @Min(-180)
  @Max(180)
  longitude!: number;
}
