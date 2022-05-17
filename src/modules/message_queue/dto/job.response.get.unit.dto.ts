import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Week } from "./enums/week.enum";

export class JobResponseUnitGetDto {
  @ApiProperty({
    description: 'Notification 고유번호',
    example:"1"
  })
  @IsNotEmpty()
  @IsString()
  readonly alertId: number;

  @ApiProperty({
    description: 'Notification 시간',
    example:"10:24"
  })
  @IsNotEmpty()
  @IsString()
  readonly alertTime: string;

  @ApiProperty({
    description: 'Notification 요일',
    isArray:true,
    enum: Week,
    example:['Mon','Fri']
  })
  @IsEnum(Week,{each:true})
  readonly alertWeek:string[]

  @ApiProperty({
    description: 'Notification 여부',
    example:true
  })
  @IsBoolean()
  readonly isPush:boolean;

  @ApiProperty({
    description: 'Notificatino 약 이름',
    example:"마그네슘"
  })
  @IsNumber()
  readonly pillName:string;

  @ApiProperty({
    description: '약을 먹었는가?',
    example:"마그네슘"
  })
  @IsNumber()
  readonly eatId:number;

  @ApiProperty({
    description: '약을 먹었는가?',
    example:"마그네슘"
  })
  @IsNumber()
  readonly eatResult:boolean;
}
