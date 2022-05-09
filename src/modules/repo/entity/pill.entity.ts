import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Job } from './job.entity';

@Entity('Pill')
export class Pill {
  @PrimaryGeneratedColumn()
  pillId: number;

  @Column({
    type: 'text',
    name: 'pillName',
  })
  pillName: string;

  @Column({
    type: 'text',
    name: 'pillDesc',
  })
  pillDesc: string;

  @OneToMany(()=>Job,(job)=>job.pillId,{ nullable: true })
  alert:Job[]
}