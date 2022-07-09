import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Job')
export class Job {
	@PrimaryGeneratedColumn()
	alertId: number;

	@Column({
		type: 'boolean',
		name: 'isPush',
	})
	isPush: boolean;
	@Column({
		type: 'text',
		name: 'bullId',
		nullable: true,
	})
	bullId: string;

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

	@Column({
		type: 'boolean',
		name: 'IsRemoved',
	})
	IsRemoved: boolean;

	@Column({
		type: 'int',
		name: 'dosage',
	})
	dosage: number;

	@Column({
		type: 'int',
		name: 'userId',
	})
	userId: number;
}
