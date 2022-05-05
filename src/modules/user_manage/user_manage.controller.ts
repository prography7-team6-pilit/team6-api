import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller({
	version: '1',
	path: 'user',
})
@ApiTags('사용자 관련 API')
export class UserManageController {
    @ApiOperation({summary:'서비스 접근'})
    @Get()
	getUser() {
		return 'sample';
	}
	@ApiOperation({summary:'닉네임 등록'})
    @Post()
	setUser() {
		return 'sample';
	}
}
