import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class UserResponseDto {
  @ApiProperty({
    description: '실행결과',
    example:"true"
  })
  @IsNotEmpty()
  @IsBoolean()
  readonly result: boolean;

  @ApiProperty({
    description: 'accessToken',
    example:"827462836719eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiODI3NDYyODM2NzE5Iiwibmlja25hbWUiOnsidXNlcmlkIjoyLCJ1dWlkIjoiODI3NDYyODM2NzE5Iiwibmlja25hbWUiOiLtlYTrp4HsnbQifSwiaWF0IjoxNjUxODM5Mzg5LCJleHAiOjE2NTE4NDI5ODl9.7Mo_lwP7rqioqhHem9F04jg1EhkuJ--8WLIB3SMza2o"
  })
  @IsNotEmpty()
  @IsString()
  readonly accessToken: string;
}
