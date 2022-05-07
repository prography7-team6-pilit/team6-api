import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class PillRequestDto {
  @ApiProperty({
    description: '약의 이름',
    example:"마그네슘"
  })
  @IsNotEmpty()
  @IsString()
  readonly pillName: string;

  @ApiProperty({
    description: '약의 상세내용',
    example:"마그네슘과 비타민을 함께 먹으면 오래 살 수 도 있습니다."
  })
  @IsNotEmpty()
  @IsString()
  readonly pillDesc: string;
}
