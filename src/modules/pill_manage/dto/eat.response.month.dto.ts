import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { EatResponseMonthUnitDto } from "./eat.response.month.unit.dto";

export class EatResponseMonthDto {
  @ApiProperty({
    description: '월별 섭취 정보',
    example:`[
        {
          "eatDate": "1",
          "state": 0
        },
        {
          "eatDate": "2",
          "state": 1
        }
      ]`
  })
  @IsNotEmpty()
  readonly eat: EatResponseMonthUnitDto[];
}