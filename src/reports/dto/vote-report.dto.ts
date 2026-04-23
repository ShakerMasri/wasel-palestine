import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VoteReportDto {
  @ApiProperty({
    type: String,
    example: 'upvote',
    description: 'Vote direction',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['upvote', 'downvote'])
  vote_type!: 'upvote' | 'downvote';
}
