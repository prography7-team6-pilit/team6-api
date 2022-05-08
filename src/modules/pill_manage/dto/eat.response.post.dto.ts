import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty } from "class-validator";

export class EatResponseDto {
  @ApiProperty({
    description: '체크되면 True, 체크해제되면 False',
    example:"true"
  })
  @IsNotEmpty()
  @IsBoolean()
  result: boolean;
}
