import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty } from "class-validator";

export class JobResponsePostDto {
  @ApiProperty({
    description: '성공 여부',
    example:true
  })
  @IsNotEmpty()
  @IsBoolean()
  result: boolean;
}
