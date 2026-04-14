import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateReportDto {
  @IsNumber()
  @IsNotEmpty()
  user_id!: number;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  @IsNotEmpty()
  latitude!: number;

  @IsNumber()
  @IsNotEmpty()
  longitude!: number;
}
