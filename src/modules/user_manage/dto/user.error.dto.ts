import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class UserResponseErrorDto {
  @ApiProperty({
    description: '실행결과',
    example:"false"
  })
  @IsNotEmpty()
  @IsBoolean()
  readonly result: boolean;

  @ApiProperty({
    description: '오류명',
    example: 'Unauthorized',
  })
  @IsNotEmpty()
  @IsString()
  readonly error:string;
}
