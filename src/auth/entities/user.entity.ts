import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

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
}
