import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty } from "class-validator";

export class JobResponseDeleteDto {
  @ApiProperty({
    description: '제거 여부',
    example:true
  })
  @IsNotEmpty()
  @IsBoolean()
  result: boolean;
}
