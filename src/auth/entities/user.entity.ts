import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserReport } from '../../route-mobility/entities/user-report.entity';
import { ReportVote } from '../../route-mobility/entities/report-vote.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password_hash!: string;

  @Column({
    type: 'enum',
    enum: ['Admin', 'Moderator', 'Citizen'],
    default: 'Citizen',
  })
  role!: string;

  @Column({ type: 'float', default: 0.0 })
  credibility_score!: number;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => UserReport, (report) => report.user)
  reports!: UserReport[];

  @OneToMany(() => ReportVote, (vote) => vote.user)
  votes!: ReportVote[];
}
