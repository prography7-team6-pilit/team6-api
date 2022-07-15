import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class JobRequestPutDto {
	@ApiProperty({
		name: 'alertId',
		description: '알람Id',
		example: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	alertId: number;
}
