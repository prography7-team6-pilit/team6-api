import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class JobRequestDeleteDto {
  @ApiProperty({
    name:'alertId',
    description: '알람Id',
    example:1
  })
  @IsNotEmpty()
  @IsNumber()
  alertId: number;
}