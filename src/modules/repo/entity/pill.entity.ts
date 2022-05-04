import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Pill')
export class Pill {
  @PrimaryGeneratedColumn()
  pillId: number;

  @Column({
    type: 'text',
    name: 'pillName',
  })
  pillName: string;
}