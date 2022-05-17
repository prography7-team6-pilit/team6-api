import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class EatRequestDto {
  @ApiProperty({
    description: 'eatId',
    example:1
  })
  @IsNotEmpty()
  @IsNumber()
  readonly eatId: number;
}