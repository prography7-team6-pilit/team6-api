import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";
import { JobResponseUnitGetDto } from "./job.response.get.unit.dto";

export class JobResponseGetDto {
  @ApiProperty({
    description: '오늘의 알림 목록',
    example:`[
        {
          "jobId": 7,
          "jobTitle": "띵동!",
          "jobDesc": "고혈압 약 먹을 시간입니다.",
          "jobTime": "11:24",
          "jobWeek": [
            "Fri"
          ],
          "isPush": true,
          "pillId": "1",
          "pillName": "마그네슘",
          "eatId": "3",
          "eatResult": true
        },
        {
          "jobId": 8,
          "jobTitle": "띵동!",
          "jobDesc": "고혈압 약 먹을 시간입니다.",
          "jobTime": "10:24",
          "jobWeek": [
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
  readonly job: JobResponseUnitGetDto[];
}
