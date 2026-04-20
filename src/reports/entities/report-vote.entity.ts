import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('report_votes')
export class ReportVote {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  report_id!: number;

  @Column()
  user_id!: number;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    default: 'upvote',
  })
  vote_type!: 'upvote' | 'downvote';
}
