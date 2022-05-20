import { Body, Controller, Get, Post, Query, Res, UseFilters } from '@nestjs/common';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserRequestDto } from './dto/user.request.dto';
import { UserResponseErrorDto } from './dto/user.error.dto';
import { UserResponseDto } from './dto/user.reponse.dto';
import { UserManageService } from './user_manage.service';
import { AllExceptionFilter } from '@modules/http-exception.filter.ts';
import { UserRequestGetDto } from './dto/user.response.get.dto';


@UseFilters(AllExceptionFilter)
@Controller({
	version: '1',
	path: 'users',
})
@ApiTags('사용자 관련 API')
export class UserManageController {
	constructor(private readonly userService:UserManageService){};

    @ApiOperation({summary:'사용중단예정 - 서비스 접근 (AccessToken 헤더로 반환)'})
	@ApiCreatedResponse({status:201,description:"인증 성공",type:UserResponseDto})
	@ApiForbiddenResponse({status:401,description:"인증 실패",type:UserResponseErrorDto})
	@ApiQuery({name:'uuid',required:true,description:'uuid',example:'123e4567-e89b-12d3-a456-426614174000'})
	@Get('/login')
	async getUser(@Query() requestData:UserRequestGetDto,@Res() res:Response) {
		const accessToken=await this.userService.signIn(requestData.uuid);
		if(accessToken){
			const userResponse:UserResponseDto={
				accessToken:accessToken,
				result:true,
			}
			return 	res.header("accessToken",accessToken).json(userResponse);
		}
		else{
			const userResponse:UserResponseErrorDto={
				result:false,
				error:"Unauthorized",
			}
			return res.status(401).json(userResponse);
		}
		
	}

	@ApiOperation({summary:'닉네임 등록 (AccessToken 헤더로 반환)'})
	@ApiCreatedResponse({description:"닉네임 등록 성공",type:UserResponseDto})
	@ApiForbiddenResponse({description:"존재하는 uuid",type:UserResponseErrorDto})
    @Post('/join')
	async setUser(@Body() userDto:UserRequestDto,@Res() res:Response) {
		const accessToken=await this.userService.signUp(userDto);
		if(accessToken){
			const userResponse:UserResponseDto={
				accessToken:accessToken,
				result:true,
			}
			return res.header("accessToken",accessToken).json(userResponse);
		}
		else{
			const userResponse:UserResponseErrorDto={
				result:false,
				error:"The user already exists."
			}
			return res.status(401).json(userResponse);
		}
	}
}
