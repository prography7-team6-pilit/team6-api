import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
    name: 'jobWeek',
  })
  jobWeek: string[];
  @Column({
    type: 'text',
    name: 'isPush',
  })
  isPush: boolean;
}