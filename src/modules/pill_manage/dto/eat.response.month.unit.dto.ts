import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber } from "class-validator";

export class EatResponseMonthUnitDto {
  @ApiProperty({
    description: '날짜',
    example: '2022-05-12'
  })
  @IsNotEmpty()
  @IsDate()
  readonly eatDate:String;

  @ApiProperty({
    description: '상태는 총 두가지로 표현되며 [ 미완료(0), 완료(1) ] 데이터가 없는 날은 날짜가 나오지 않습니다.'
  })
  @IsNotEmpty()
  @IsNumber()
  readonly pillState:number; 
}