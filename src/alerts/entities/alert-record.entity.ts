import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class AlertRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  message!: string;

  @Column({ default: false })
  isRead!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User)
  user!: User;
}