import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReportStatusDto {
  @ApiProperty({
    example: 'In Progress',
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
  })
  @IsEnum(['Open', 'In Progress', 'Resolved', 'Closed'], {
    message: 'Report status is invalid',
  })
  @IsNotEmpty()
  status!: string;
}
