import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class EatRequestDto {
  @ApiProperty({
    description: 'alertId',
    example:"1"
  })
  @IsNotEmpty()
  @IsNumber()
  readonly alertId: number;
}