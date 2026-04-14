import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class VoteReportDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['upvote', 'downvote'])
  vote_type!: 'upvote' | 'downvote';
}
