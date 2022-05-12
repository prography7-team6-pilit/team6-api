import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import { Job } from './job.entity';

@Entity('Eat')
export class Eat {
  @PrimaryGeneratedColumn()
  eatId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP',name:'eatDate'})
  eatDate:Date

  @ManyToOne(()=>Job,(job)=>job.alertId,{ nullable: false, eager: true })
  @JoinColumn({name:"alertId"})
  alertId:number;
}