import { AlertBullService } from '@modules/alert-bull';
import { JwtAuthGuard } from '@modules/user/user.guard';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@Controller({
	version: '1',
	path: 'bull-manage',
})
@ApiTags('')
export class BullManageController {
	constructor(private readonly alertBullService: AlertBullService) {}

	@ApiBearerAuth('access-token')
	@ApiOperation({ summary: 'Job 전체제거', description: '작동제한' })
	@UseGuards(JwtAuthGuard)
	@Get('/')
	async removeAllJob(@Req() req: Request) {
		const userId = req.user!.userId;
	}
}
