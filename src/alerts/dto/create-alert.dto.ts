import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAlertDto {
  @IsString()
  @IsNotEmpty({ message: 'Please specify the geographic region.' })
  region: string = '';

  @IsString()
  @IsNotEmpty({ message: 'Please select the alert category.' })
  category: string = '';
}