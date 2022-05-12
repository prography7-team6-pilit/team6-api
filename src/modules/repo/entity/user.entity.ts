import { Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Eat } from './eat.entity';
import { Job } from './job.entity';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  userId:number;

  @Column({
    unique:true
  })
  @Generated('uuid')
  uuid: string;

  @Column({
    type: 'text',
    name: 'nickname',
  })
  nickname: string;

  @Column({
    type: 'text',
    name: 'firebasetoken',
  })
  firebasetoken: string;

  @OneToMany(()=>Job,(job)=>job.alertId,{ nullable: true })
  alert:Job[]
}