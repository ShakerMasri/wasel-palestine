import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Checkpoint } from '../../checkpoints/entities/checkpoint.entity';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class Incident {
    @PrimaryGeneratedColumn()

    id!: number;

    @Column()
    type!: string;

    @Column()
    severity!: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ default: false })
    isVerified!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => Checkpoint, (checkpoint) => checkpoint.incidents)
    checkpoint!: Checkpoint;

    @ManyToOne(() => User)
    creator!: User;
}