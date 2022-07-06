import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ErrorDto {
	@ApiProperty({
		description: 'status',
		example: 500,
	})
	status: number;

	@ApiProperty({
		description: 'message',
		example: '잘못된 정보입니다',
	})
	message: string;
}
