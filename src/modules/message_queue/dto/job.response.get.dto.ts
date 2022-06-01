import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { JobResponseUnitGetDto } from './job.response.get.unit.dto';

export class JobResponseGetDto {
	@ApiProperty({
		description: '오늘의 알림 목록',
		example: `[
        {
          "alertId": 7,
          "alertTime": "11:24",
          "alertWeek": [
            "Fri"
          ],
          "isPush": true,
          "pillName": "마그네슘",
          "eatId": 3,
          "dosage":1,
          "eatResult": true
        },
        {
          "alertId": 8,
          "alertTime": "10:24",
          "alertWeek": [
            "Fri"
          ],
          "isPush": true,
          "pillName": "마그네슘",
          "eatId": 0,
          "dosage":1,
          "eatResult": false
        }
      ]`,
	})
	@IsNotEmpty()
	readonly alerts: JobResponseUnitGetDto[];
}
