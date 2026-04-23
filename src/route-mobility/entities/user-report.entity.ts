import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { ReportVote } from './report-vote.entity';

@Entity('user_reports')
export class UserReport {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  category!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column('decimal', { precision: 10, scale: 8 })
  latitude!: number;

  @Column('decimal', { precision: 11, scale: 8 })
  longitude!: number;

  @Column({ default: 'Open' })
  status!: string;

  @Column({ name: 'upvotes_count', default: 0 })
  upvotesCount!: number;

  @Column({ name: 'downvotes_count', default: 0 })
  downvotesCount!: number;

  @CreateDateColumn({ name: 'timestamp' })
  timestamp!: Date;

  @ManyToOne(() => User, (user) => user.reports)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => ReportVote, (vote) => vote.report)
  votes!: ReportVote[];
}
