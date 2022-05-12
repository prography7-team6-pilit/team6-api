import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";

export class JobResponseDto {
  @ApiProperty({
    description: '등록 여부',
    example:true
  })
  @IsNotEmpty()
  @IsBoolean()
  readonly result: boolean;

  @ApiProperty({
    description: '알림 Id',
    example:"1"
  })
  @IsNotEmpty()
  @IsNumber()
  readonly alertId: number;

}
