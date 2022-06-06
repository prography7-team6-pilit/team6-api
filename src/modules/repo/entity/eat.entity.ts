import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Eat')
export class Eat {
	@PrimaryGeneratedColumn()
	eatId: number;

	@Column({
		type: 'date',
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
		name: 'alertTimeId',
	})
	alertTimeId: number;
}
