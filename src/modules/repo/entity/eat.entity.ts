import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Eat')
export class Eat {
	@PrimaryGeneratedColumn()
	eatId: number;

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
		name: 'eatDate',
	})
	eatDate: Date;

	@Column({
		type: 'int',
		name: 'userId',
	})
	userId: number;

	@Column({
		type: 'int',
		name: 'alertId',
	})
	alertId: number;
}
