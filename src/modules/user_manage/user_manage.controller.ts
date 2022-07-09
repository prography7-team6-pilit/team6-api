import {
	Body,
	Controller,
	Get,
	HttpException,
	Post,
	Query,
	Res,
	UseFilters,
} from '@nestjs/common';
import {
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiOperation,
	ApiQuery,
	ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { UserRequestDto } from './dto/user.request.dto';
import { UserResponseDto } from './dto/user.reponse.dto';
import { UserManageService } from './user_manage.service';
import { UserRequestGetDto } from './dto/user.response.get.dto';

@Controller({
	version: '1',
	path: 'users',
})
@ApiTags('사용자 관련 API')
export class UserManageController {
	constructor(private readonly userService: UserManageService) {}

	@ApiOperation({
		summary: '계정 불러오기',
	})
	@ApiCreatedResponse({
		status: 201,
		description: '인증 성공',
		type: UserResponseDto,
	})
	@ApiForbiddenResponse({
		status: 403,
		description: '잘못된 인증입니다',
	})
	@ApiQuery({
		name: 'uuid',
		required: true,
		description: 'uuid',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@Get('/login')
	async getUser(@Query() requestData: UserRequestGetDto, @Res() res: Response) {
		const accessToken = await this.userService.signIn(requestData.uuid);
		if (!accessToken) {
			throw new HttpException('잘못된 인증입니다', 403);
		}
		const userResponse: UserResponseDto = {
			accessToken: accessToken,
			result: true,
		};
		return res.header('accessToken', accessToken).json(userResponse);
	}

	@ApiOperation({ summary: '계정 등록' })
	@ApiCreatedResponse({
		description: '가입 성공',
		type: UserResponseDto,
	})
	@ApiForbiddenResponse({
		status: 403,
		description: '존재하는 UUID 입니다.',
	})
	@Post('/join')
	async setUser(@Body() userDto: UserRequestDto, @Res() res: Response) {
		const accessToken = await this.userService.signUp(userDto);
		if (accessToken) {
			const userResponse: UserResponseDto = {
				accessToken: accessToken,
				result: true,
			};
			return res.header('accessToken', accessToken).json(userResponse);
		}
	}
}
