import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UserRequestDto {
  @ApiProperty({
    description: 'uuid',
    example:"123e4567-e89b-12d3-a456-426614174000"
  })
  @IsNotEmpty()
  @IsString()
  readonly uuid: string;

  @ApiProperty({
    description: 'nickname',
    example:"필링이"
  })
  @IsNotEmpty()
  @IsString()
  readonly nickname: string;

  @ApiProperty({
    description: 'firebasetoken',
    example:"bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1"
  })
  @IsNotEmpty()
  @IsString()
  readonly firebasetoken: string;
}
