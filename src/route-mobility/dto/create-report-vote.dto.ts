import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReportVoteDto {
  @IsNumber()
  @IsNotEmpty()
  reportId!: number;

  @IsEnum(['Upvote', 'Downvote'], {
    message: 'The voting type should be Upvote or Downvote',
  })
  @IsNotEmpty()
  vote_type!: string;
}
