import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class EatRequestDto {
	@ApiProperty({
		description: 'alertTimeId',
		example: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	readonly alertTimeId: number;
}
