import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('DayTakingLog')
export class DayTakingLog {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'date',
		name: 'date',
	})
	date: Date;

	@Column({
		type: 'int',
		name: 'takeStatus',
	})
	takeStatus: number;

	@Column({
		type: 'int',
		name: 'userId',
	})
	userId: number;
}
