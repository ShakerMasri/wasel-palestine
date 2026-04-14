import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('user_reports')
export class UserReport {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id!: number;

  @Column()
  category!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude!: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude!: number;

  @Column({ default: 'pending' })
  status!: string;

  @Column({ default: 0 })
  upvotes_count!: number;

  @Column({ default: 0 })
  downvotes_count!: number;

  @CreateDateColumn()
  timestamp!: Date;
}
