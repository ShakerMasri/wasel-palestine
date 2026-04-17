// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
// import { Checkpoint } from '../../checkpoints/entities/checkpoint.entity';
// import { User } from '../../auth/entities/user.entity';

// @Entity()
// export class Incident {
//     @PrimaryGeneratedColumn()
//     id!: number;

//     @Column()
//     type!: string;

//     @Column()
//     severity!: string;

//     @Column({ nullable: true })
//     description?: string;

//     @Column({ default: false })
//     isVerified!: boolean;

//     @CreateDateColumn()
//     createdAt!: Date;

//     @Column({ nullable: true })
//     checkpointId?: number;

//     @ManyToOne(() => Checkpoint, (checkpoint) => checkpoint.incidents)
//     @JoinColumn({ name: 'checkpointId' }) // هاد السطر بيمنع الـ 500 error
//     checkpoint!: Checkpoint;

//     @Column({ nullable: true })
//     userId?: number;

//     @ManyToOne(() => User)
//     @JoinColumn({ name: 'userId' })
//     creator!: User;

//     @Column({ nullable: true })
//     locationDetails?: string;
// }

// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// @Entity()
// export class Incident {
//     @PrimaryGeneratedColumn()
//     id!: number;

//     @Column()
//     type!: string;

//     @Column()
//     severity!: string;

//     @Column({ nullable: true })
//     description?: string;

//     @Column({ default: false })
//     isVerified!: boolean;

//     @CreateDateColumn()
//     createdAt!: Date;

//     @Column({ nullable: true })
//     checkpointId?: number;

//     @Column({ nullable: true })
//     userId?: number;

//     @Column({ nullable: true })
//     locationDetails?: string;
// }
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Incident {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true }) // خليها nullable عشان لو نقصت بالطلب ما يضرب 500
    type?: string;

    @Column({ nullable: true }) // نفس الإشي هون
    severity?: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ default: false })
    isVerified!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ nullable: true })
    checkpointId?: number;

    @Column({ nullable: true })
    userId?: number;

    @Column({ nullable: true })
    locationDetails?: string;
}