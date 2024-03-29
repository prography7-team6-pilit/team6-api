import {
	Body,
	Controller,
	Get,
	HttpException,
	Post,
	Query,
	Res,
} from '@nestjs/common';
import {
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiOperation,
	ApiQuery,
	ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { UserResponseDto } from './dto/user.reponse.dto';
import { UserRequestDto } from './dto/user.request.dto';
import { UserRequestGetDto } from './dto/user.response.get.dto';
import { UserService } from './user.service';

@Controller({
	version: '1',
	path: 'users',
})
@ApiTags('사용자 관련 API')
export class UserController {
	constructor(private readonly userService: UserService) {}

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
		const user = await this.userService.signIn(requestData.uuid);
		if (!user) {
			throw new HttpException('잘못된 인증입니다', 403);
		}
		const userResponse: UserResponseDto = {
			accessToken: user.accessToken,
			nickname: user.nickname,
			result: true,
		};
		return res.header('accessToken', user.accessToken).json(userResponse);
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
		const user = await this.userService.signUp(userDto);
		if (!user) {
			throw new HttpException('입력정보가 올바르지 않습니다', 400);
		}
		const userResponse: UserResponseDto = {
			accessToken: user.accessToken,
			nickname: user.nickname,
			result: true,
		};
		return res.header('accessToken', user.accessToken).json(userResponse);
	}
}
