import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsMilitaryTime, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Week } from "./enums/week.enum";

export class JobRequestPostDto {
  @ApiProperty({
    description: 'Notification 제목',
    example:"띵동!"
  })
  @IsNotEmpty()
  @IsString()
  readonly jobTitle: string;

  @ApiProperty({
    description: 'Notification 내용',
    example:"고혈압 약 먹을 시간입니다."
  })
  @IsNotEmpty()
  @IsString()
  readonly jobDesc: string;

  @ApiProperty({
    description: 'Notification 시간',
    example:"10:24"
  })
  @IsNotEmpty()
  @IsString()
  readonly jobTime: string;

  @ApiProperty({
    description: 'Notification 요일',
    isArray:true,
    enum: Week,
    example:['Mon','Fri']
  })
  @IsEnum(Week,{each:true})
  readonly jobWeek:string[]

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
}
