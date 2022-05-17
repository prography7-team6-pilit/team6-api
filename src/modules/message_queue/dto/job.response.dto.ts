import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";

export class JobResponseDto {
  @ApiProperty({
    description: '성공 여부',
    example:true
  })
  @IsNotEmpty()
  @IsBoolean()
  result: boolean;
}
