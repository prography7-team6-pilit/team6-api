import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class EatRequestDto {
  @ApiProperty({
    description: 'jobId',
    example:"1"
  })
  @IsNotEmpty()
  @IsNumber()
  readonly jobId: number;
}