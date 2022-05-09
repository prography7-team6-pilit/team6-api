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
    description: 'Notification 제목',
    example:"띵동!"
  })
  @IsNotEmpty()
  @IsString()
  readonly alertTitle: string;

  @ApiProperty({
    description: 'Notification 내용',
    example:"고혈압 약 먹을 시간입니다."
  })
  @IsNotEmpty()
  @IsString()
  readonly alertDesc: string;

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
    description: 'Notificatino 약 고유번호',
    example:1
  })
  @IsNumber()
  readonly pillId:number;

  @ApiProperty({
    description: 'Notificatino 약 이름',
    example:"마그네슘"
  })
  @IsNumber()
  readonly pillName:string;
}
