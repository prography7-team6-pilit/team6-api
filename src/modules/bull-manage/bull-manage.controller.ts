import { AlertBullService } from '@modules/alert-bull';
import { Controller, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteJobDto } from './dto/delete-job.dto';

@Controller({
	version: '1',
	path: 'bull-manage',
})
@ApiTags('관리자 전용')
export class BullManageController {
	constructor(private readonly alertBullService: AlertBullService) {}

	@ApiOperation({ summary: 'Job 전체제거', description: '작동제한' })
	@Delete('/')
	async removeAllJob(@Query() rootKeyDto: DeleteJobDto) {
		if (process.env.JWT != rootKeyDto.rootKey) {
			return '관리자에게 요청하세요';
		}
		return await this.alertBullService.removeAllJob();
	}
}
