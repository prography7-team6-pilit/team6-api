import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { EatResponseMonthUnitDto } from "./eat.response.month.unit.dto";

export class EatResponseMonthDto {
  @ApiProperty({
    description: '월별 섭취 정보',
    example:`[
        {
          "eatDate": "2022-05-09",
          "pillState": 0
        },
        {
          "eatDate": "2022-05-10",
          "pillState": 1
        }
      ]`
  })
  @IsNotEmpty()
  readonly takelogs: EatResponseMonthUnitDto[];
}