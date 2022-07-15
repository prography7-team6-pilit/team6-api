import { Week } from '@modules/alert/dto/enums/week.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('AlertTime')
export class AlertTime {
	@PrimaryGeneratedColumn()
	alertTimeId: number;

	@Column({
		type: 'text',
		name: 'week',
	})
	week: Week;

	@Column({
		type: 'text',
		name: 'time',
	})
	time: string;

	@Column({
		type: 'int',
		name: 'userId',
	})
	userId: number;

	@Column({
		type: 'int',
		name: 'pillId',
	})
	pillId: number;

	@Column({
		type: 'text',
		name: 'bullId',
		nullable: true,
	})
	bullId: string;
}
