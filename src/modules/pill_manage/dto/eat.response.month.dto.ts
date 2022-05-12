import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { EatResponseMonthUnitDto } from "./eat.response.month.unit.dto";

export class EatResponseMonthDto {
  @ApiProperty({
    description: '월별 섭취 정보',
    example:`[
        {
          "eatDate": "2022-05-09",
          "state": 0
        },
        {
          "eatDate": "2022-05-10",
          "state": 1
        }
      ]`
  })
  @IsNotEmpty()
  readonly takelogs: EatResponseMonthUnitDto[];
}