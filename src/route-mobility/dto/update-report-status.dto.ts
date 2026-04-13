import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateReportStatusDto {
  @IsEnum(['Open', 'In Progress', 'Resolved', 'Closed'], {
    message: 'Report status is invalid',
  })
  @IsNotEmpty()
  status!: string;
}
