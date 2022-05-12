import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Week } from "./enums/week.enum";

export class JobRequestPostDto {
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
  @IsString()
  readonly pillName:string;
}
