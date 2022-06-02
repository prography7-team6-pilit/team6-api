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
	alertId: number;

	@ApiProperty({
		description: 'Notification 시간',
		example: ['10:24', '15:34', '17:01'],
	})
	@IsNotEmpty()
	alertTime: string[];

	@ApiProperty({
		description: 'Notification 요일',
		isArray: true,
		enum: Week,
		example: ['Mon', 'Fri'],
	})
	@IsNotEmpty()
	@IsEnum(Week, { each: true })
	alertWeek: string[];

	@ApiProperty({
		description: 'Notification 여부',
		example: true,
	})
	@IsNotEmpty()
	@IsBoolean()
	isPush: boolean;

	@ApiProperty({
		description: 'Notificatino 약 이름',
		example: '마그네슘',
	})
	@IsNotEmpty()
	@IsString()
	pillName: string;

	@ApiProperty({
		description: '약을 먹었는가?',
		example: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	eatId: number;

	@ApiProperty({
		description: '복용량',
		example: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	dosage: number;

	@ApiProperty({
		description: '약을 먹었는가?',
		example: true,
	})
	@IsNotEmpty()
	@IsBoolean()
	eatResult: boolean;
}
