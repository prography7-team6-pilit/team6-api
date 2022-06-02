import { ApiProperty } from '@nestjs/swagger';
import {
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsString,
} from 'class-validator';
import { Week } from './enums/week.enum';

export class JobResponseUnitGetDto {
	@ApiProperty({
		description: 'Notification 고유번호',
		example: '1',
	})
	@IsNotEmpty()
	@IsNumber()
	readonly alertId: number;

	@ApiProperty({
		description: 'Notification 시간',
		example: '10:24',
	})
	@IsNotEmpty()
	@IsString()
	readonly alertTime: string;

	@ApiProperty({
		description: 'Notification 요일',
		isArray: true,
		enum: Week,
		example: ['Mon', 'Fri'],
	})
	@IsNotEmpty()
	@IsEnum(Week, { each: true })
	readonly alertWeek: string[];

	@ApiProperty({
		description: 'Notification 여부',
		example: true,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly isPush: boolean;

	@ApiProperty({
		description: 'Notificatino 약 이름',
		example: '마그네슘',
	})
	@IsNotEmpty()
	@IsString()
	readonly pillName: string;

	@ApiProperty({
		description: '약을 먹었는가?',
		example: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	readonly eatId: number;

	@ApiProperty({
		description: '복용량',
		example: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	readonly dosage: number;

	@ApiProperty({
		description: '약을 먹었는가?',
		example: true,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly eatResult: boolean;
}
