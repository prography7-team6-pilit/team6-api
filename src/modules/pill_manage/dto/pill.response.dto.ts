import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class PillResponseDto {
  @ApiProperty({
    description: 'result',
    example:"true"
  })
  @IsNotEmpty()
  @IsBoolean()
  readonly result: boolean;

  @ApiProperty({
    description: '약의 Id',
    example:"1"
  })
  @IsNotEmpty()
  @IsNumber()
  readonly pillId: number;

  @ApiProperty({
    description: '약의 이름',
    example:"마그네슘"
  })
  @IsNotEmpty()
  @IsString()
  readonly pillName: string;

  @ApiProperty({
    description: '약의 설명',
    example:"마그네슘은 칼슘, 비타민D 와 함께 섭취하면 효과가 높아져요!마그네슘은 칼슘, 비타민D 와 함께 섭취하면 효과가 높아져요!마그네슘은 칼슘, 비타민D 와 함께 섭취하면 효과가 높아져요!"
  })  
  @IsNotEmpty()
  @IsString()
  readonly pillDesc: string;
}
