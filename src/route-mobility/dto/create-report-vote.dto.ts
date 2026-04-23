import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportVoteDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the report being voted on',
  })
  @IsNumber()
  @IsNotEmpty()
  reportId!: number;

  @ApiProperty({
    example: 'Upvote',
    enum: ['Upvote', 'Downvote'],
    description: 'The type of vote to cast',
  })
  @IsEnum(['Upvote', 'Downvote'], {
    message: 'The voting type should be Upvote or Downvote',
  })
  @IsNotEmpty()
  vote_type!: string;
}
