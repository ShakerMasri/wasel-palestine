import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class CheckpointHistory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    status!: string;

    @Column({ nullable: true })
    note!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne('Checkpoint', 'histories')
    checkpoint!: any;

    @ManyToOne(() => User)
    user!: User;
}