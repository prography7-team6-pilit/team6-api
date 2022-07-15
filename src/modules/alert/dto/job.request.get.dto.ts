import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class JobRequestGetDto {
	@ApiProperty({
		name: 'year',
		description: '년도',
		example: 2022,
	})
	@IsNotEmpty()
	@IsNumber()
	year: number;

	@ApiProperty({
		name: 'month',
		description: '월',
		example: 5,
	})
	@IsNotEmpty()
	@IsNumber()
	month: number;

	@ApiProperty({
		name: 'day',
		description: '일',
		example: 9,
	})
	@IsNotEmpty()
	@IsNumber()
	day: number;
}
