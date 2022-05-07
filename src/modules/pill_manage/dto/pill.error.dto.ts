import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class PillResponseErrorDto {
  @ApiProperty({
    description: 'result',
    example:"false"
  })
  @IsNotEmpty()
  @IsBoolean()
  readonly result: boolean;
  
  @ApiProperty({
    description: 'error',
    example:"No name"
  })
  @IsNotEmpty()
  @IsString()
  readonly error: string;
}
