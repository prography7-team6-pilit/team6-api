import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  userid: number;

  @Column({
    type: 'text',
    name: 'uuid',
  })
  name: string;

  @Column({
    type: 'text',
    name: 'nickname',
  })
  nickname: string;
}