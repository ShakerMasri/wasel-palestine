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

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  latitude!: number | null;

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  longitude!: number | null;

  @Column({ default: 'Open' })
  currentStatus!: string;

  @OneToMany(() => Incident, (incident) => incident.checkpoint)
  incidents!: Incident[];

  @OneToMany('CheckpointHistory', 'checkpoint')
  histories!: any[];
}
