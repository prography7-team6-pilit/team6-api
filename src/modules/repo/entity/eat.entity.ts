import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import { Job } from './job.entity';
import { User } from './user.entity';

@Entity('Eat')
export class Eat {
  @PrimaryGeneratedColumn()
  eatId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP',name:'eatDate'})
  eatDate:Date

  @ManyToOne(()=>Job,(job)=>job.alertId)
  @JoinColumn({name:"alertId"})
  alertId:number;

  @ManyToOne(()=>User,(user)=>user.userId)
  @JoinColumn({name:"userId"})
  userId:number;
}