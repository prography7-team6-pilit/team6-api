import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Eat } from './eat.entity';
import { User } from './user.entity';

@Entity('Job')
export class Job {
  @PrimaryGeneratedColumn()
  alertId: number;

  @Column({
    type: 'text',
    name: 'alertTime',
  })
  alertTime: string;
  @Column({
    type: 'boolean',
    name: 'isPush',
  })
  isPush: boolean;
  @Column({
    type: 'text',
    name: 'bullId',
  })
  bullId: string;

  @Column({
    type: 'boolean',
    name: 'Mon',
  })
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

  @Column({
    type: 'text',
    name: 'firebasetoken',
  })
  firebasetoken: string;

  @Column({
    type: 'text',
    name: 'pillName',
  })
  pillName: string;
  
  @ManyToOne(()=>User,(user)=>user.userId)
  @JoinColumn({name:"userId"})
  userId:number;

  @OneToMany(()=>Eat,(eat)=>eat.alertId,{ nullable: true })
  eat:Eat[];
}