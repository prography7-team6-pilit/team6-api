import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { JobResponseUnitGetDto } from './job.response.get.unit.dto';

export class JobResponseGetDto {
	@ApiProperty({
		description: '오늘의 알림 목록',
		example: `{
      "alerts": [
        {
          "alertId": 178,
          "alertTime": [
            "12:24"
          ],
          "alertWeek": [
            "Mon"
          ],
          "isPush": true,
          "pillName": "마그네슘",
          "dosage": 2,
          "alertTimeId": 239,
          "eatResult": false
        },
        {
          "alertId": 179,
          "alertTime": [
            "17:01"
          ],
          "alertWeek": [
            "Mon",
            "Fri"
          ],
          "isPush": true,
          "pillName": "비타민A",
          "dosage": 6,
          "alertTimeId": 240,
          "eatResult": true
        },
      ]
    }`,
	})
	@IsNotEmpty()
	readonly alerts: JobResponseUnitGetDto[];
}
