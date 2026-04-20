import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { UserReport } from './user-report.entity';

@Entity('moderation_logs')
export class ModerationLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  admin_id!: number;

  @Column()
  report_id!: number;

  @Column({ type: 'varchar' })
  action!: 'approve' | 'reject';

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'admin_id' })
  admin!: User;

  @ManyToOne(() => UserReport, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'report_id' })
  report!: UserReport;
}
