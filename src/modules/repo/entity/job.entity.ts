import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Eat } from './eat.entity';
import { Pill } from './pill.entity';
import { User } from './user.entity';

@Entity('Job')
export class Job {
  @PrimaryGeneratedColumn()
  jobId: number;

  @Column({
    type: 'text',
    name: 'jobTitle',
  })
  jobTitle: string;
  @Column({
    type: 'text',
    name: 'jobDesc',
  })
  jobDesc: string;
  @Column({
    type: 'text',
    name: 'jobTime',
  })
  jobTime: string;
  @Column({
    type: 'text',
    name: 'isPush',
  })
  isPush: boolean;
  @Column({
    type: 'text',
    name: 'bullId',
  })
  bullId: string;

    Mon: boolean;
  @Column({
    type: 'boolean',
    name: 'Tue',
  })
  Tue: boolean;
  @Column({
    type: 'boolean',
    name: 'Wed',
  })
  Wed: boolean;
  @Column({
    type: 'boolean',
    name: 'Thu',
  })
  Thu: boolean;
  @Column({
    type: 'boolean',
    name: 'Fri',
  })
  Fri: boolean;
  @Column({
    type: 'boolean',
    name: 'Sat',
  })
  Sat: boolean;
  @Column({
    type: 'boolean',
    name: 'Sun',
  })
  Sun: boolean;
  
  @ManyToOne(()=>Pill,(pill)=>pill.pillId)
  @JoinColumn({name:"pillId"})
  pillId:number;

  @ManyToOne(()=>User,(user)=>user.userId)
  @JoinColumn({name:"userId"})
  userId:number;

  @OneToMany(()=>Eat,(eat)=>eat.jobId,{ nullable: true })
  eat:Eat[];
}