import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";

export class JobResponseErrorDto {
  @ApiProperty({
    description: '등록 여부',
    example:"false"
  })
  @IsNotEmpty()
  @IsBoolean()
  readonly result: boolean;

  @ApiProperty({
    description: 'error',
    example:"Invalid format"
  })
  @IsNotEmpty()
  @IsNumber()
  readonly error: string;
}
