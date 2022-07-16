import { JwtAuthGuard } from '@modules/user/user.guard';
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	Param,
	Post,
	Put,
	Query,
	Req,
	UseGuards,
	ValidationPipe,
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AlertService } from './alert.service';
import { JobRequestDeleteDto } from './dto/job.request.delete.dto';
import { JobRequestGetDto } from './dto/job.request.get.dto';
import { JobRequestPostDto } from './dto/job.request.post.dto';
import { JobRequestPutDto } from './dto/job.request.put.dto';
import { JobResponseDto } from './dto/job.response.dto';
import { JobResponseGetDto } from './dto/job.response.get.dto';

@Controller({
	version: '1',
	path: 'pill-alerts',
})
@ApiTags('알람 등록 API')
export class AlertController {
	constructor(private alertService: AlertService) {}

	@ApiBearerAuth('access-token')
	@ApiOperation({ summary: '알람 조회' })
	@ApiCreatedResponse({ description: '성공', type: JobResponseGetDto })
	@ApiUnauthorizedResponse({ description: 'Unathorized(사용자 인증실패)' })
	@UseGuards(JwtAuthGuard)
	@Get('/')
	async getAlert(@Query() requestData: JobRequestGetDto, @Req() req: Request) {
		const userId = req.user!.userId;
		return await this.alertService.getPillAlert(
			requestData.year,
			requestData.month,
			requestData.day,
			userId,
		);
	}

	@ApiBearerAuth('access-token')
	@ApiOperation({ summary: '알람 등록' })
	@ApiCreatedResponse({ description: '성공', type: JobResponseDto })
	@ApiUnauthorizedResponse({ description: 'Unathorized(사용자 인증실패)' })
	@UseGuards(JwtAuthGuard)
	@Post('/')
	async postAlert(
		@Body(new ValidationPipe()) requestData: JobRequestPostDto,
		@Req() req: Request,
	) {
		const userId = req.user!.userId;
		const firebasetoken = req.user!.firebasetoken;
		const saveJob = await this.alertService.insertPillAlert(
			requestData.alertTime,
			requestData.isPush,
			requestData.pillName,
			requestData.alertWeek,
			userId,
			firebasetoken,
			requestData.dosage,
		);
		return { result: saveJob };
	}

	@ApiBearerAuth('access-token')
	@ApiOperation({ summary: '알람 수정' })
	@ApiCreatedResponse({ description: '성공', type: JobResponseDto })
	@ApiUnauthorizedResponse({ description: 'Unathorized(사용자 인증실패)' })
	@UseGuards(JwtAuthGuard)
	@Put('/:alertId')
	async putAlert(
		@Body(new ValidationPipe()) jobAlertData: JobRequestPostDto,
		@Param() requestPutData: JobRequestPutDto,
		@Req() req: Request,
	) {
		const userId = req.user!.userId;
		const firebaseToken = req.user!.firebasetoken;

		await this.alertService.removeAllJob(requestPutData.alertId);

		const updateJob = await this.alertService.putJob(
			jobAlertData.dosage,
			jobAlertData.isPush,
			jobAlertData.pillName,
			requestPutData.alertId,
		);

		if (!updateJob) {
			throw new HttpException('알림 내용을 업데이트하지 못했습니다.', 400);
		}
		await this.alertService.updateAlertTime(
			requestPutData.alertId,
			jobAlertData.alertWeek,
			jobAlertData.alertTime,
			userId,
			firebaseToken,
			jobAlertData.pillName,
			jobAlertData.isPush,
		);
		return { result: true };
	}

	@ApiBearerAuth('access-token')
	@ApiOperation({ summary: '알람 제거' })
	@ApiCreatedResponse({ description: '성공', type: JobResponseDto })
	@ApiParam({ name: 'alertId', required: true, example: '1' })
	@ApiUnauthorizedResponse({ description: 'Unathorized(사용자 인증실패)' })
	@UseGuards(JwtAuthGuard)
	@Delete('/:alertId')
	async removeMsg(
		@Param() requestDeleteData: JobRequestDeleteDto,
		@Req() req: Request,
	) {
		const userId = req.user!.userId;
		return await this.alertService.softDeletePillAlert(
			userId,
			requestDeleteData.alertId,
		);
	}
}
