import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";
import { JobResponseUnitGetDto } from "./job.response.get.unit.dto";

export class JobResponseGetDto {
  @ApiProperty({
    description: '오늘의 알림 목록',
    example:`[
        {
          "alertId": 7,
          "alertTitle": "띵동!",
          "alertDesc": "고혈압 약 먹을 시간입니다.",
          "alertTime": "11:24",
          "alertWeek": [
            "Fri"
          ],
          "isPush": true,
          "pillId": "1",
          "pillName": "마그네슘",
          "eatId": "3",
          "eatResult": true
        },
        {
          "alertId": 8,
          "alertTitle": "띵동!",
          "alertDesc": "고혈압 약 먹을 시간입니다.",
          "alertTime": "10:24",
          "alertWeek": [
            "Fri"
          ],
          "isPush": true,
          "pillId": 1,
          "pillName": "마그네슘",
          "eatId": "0",
          "eatResult": false
        }
      ]`
  })
  @IsNotEmpty()
  readonly alerts: JobResponseUnitGetDto[];
}
