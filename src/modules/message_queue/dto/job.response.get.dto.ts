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
            "12:30","13:00","23:30"
          ],
          "alertWeek": [
            "Mon","Fri"
          ],
          "isPush": true,
          "pillName": "비타1",
          "dosage": 1,
          "alertTimeId": 239,
          "eatResult": true
        },
        {
          "alertId": 179,
          "alertTime": [
            "17:00","20:00","23:30"
          ],
          "alertWeek": [
            "Mon"
          ],
          "isPush": true,
          "pillName": "마그네슘",
          "dosage": 1,
          "alertTimeId": 240,
          "eatResult": false
        },
        {
          "alertId": 180,
          "alertTime": [
            "02:30","05:00","13:00"
          ],
          "alertWeek": [
            "Mon","Thu"
          ],
          "isPush": true,
          "pillName": "철분1",
          "dosage": 1,
          "alertTimeId": 241,
          "eatResult": false
        }
      ]
    }`,
	})
	@IsNotEmpty()
	readonly alerts: JobResponseUnitGetDto[];
}
