import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { UserReport } from './user-report.entity';

@Entity('report_votes')
@Unique(['report', 'user'])
export class ReportVote {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  vote_type!: string;

  @ManyToOne(() => UserReport, (report) => report.votes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'report_id' })
  report!: UserReport;

  @ManyToOne(() => User, (user) => user.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
