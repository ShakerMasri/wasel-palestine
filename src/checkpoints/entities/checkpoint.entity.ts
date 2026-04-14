import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Incident } from '../../reports/entities/incident.entity';

@Entity()
export class Checkpoint {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  location!: string;

  @Column({ default: 'Open' })
  currentStatus!: string;

  @OneToMany('Incident', 'checkpoint')
  incidents!: any[];

  @OneToMany('CheckpointHistory', 'checkpoint')
  histories!: any[];
}
