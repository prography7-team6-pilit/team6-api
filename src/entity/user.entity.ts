import { MaxLength } from 'class-validator';
import {
	Column,
	Entity,
	Generated,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Job } from './job.entity';

@Entity('User')
export class User {
	@PrimaryGeneratedColumn()
	userId: number;

	@Column({
		type: 'varchar',
		length: 255,
		unique: true,
	})
	@Generated('uuid')
	@MaxLength(255)
	uuid: string;

	@Column({
		type: 'varchar',
		length: 255,
		name: 'nickname',
		unique: false,
	})
	@MaxLength(255)
	nickname: string;

	@Column({
		type: 'varchar',
		length: 255,
		name: 'firebasetoken',
		unique: false,
	})
	@MaxLength(255)
	firebasetoken: string;
}
