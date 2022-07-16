import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteJobDto {
	@ApiProperty({
		description: '관리자전용 키',
	})
	@IsNotEmpty()
	@IsString()
	rootKey: string;
}
