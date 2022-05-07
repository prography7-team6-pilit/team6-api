import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";
import { JobResponseUnitGetDto } from "./job.response.get.unit.dto";

export class JobResponseGetDto {
  @ApiProperty({
    description: '등록된 Job 목록',
    example:`[
        {
          "jobId": 7,
          "jobTitle": "띵동!",
          "jobDesc": "고혈압 약 먹을 시간입니다.",
          "jobTime": "11:24",
          "jobWeek": [
            "Fri"
          ],
          "isPush": "1"
        },
        {
          "jobId": 8,
          "jobTitle": "띵동!",
          "jobDesc": "고혈압 약 먹을 시간입니다.",
          "jobTime": "10:24",
          "jobWeek": [
            "Fri"
          ],
          "isPush": "1"
        }
      ]`
  })
  @IsNotEmpty()
  @IsBoolean()
  readonly job: JobResponseUnitGetDto[];
}
