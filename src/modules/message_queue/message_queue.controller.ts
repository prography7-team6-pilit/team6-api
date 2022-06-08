import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	Req,
	Res,
	UseFilters,
	UseGuards,
	ValidationPipe,
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JobRequestPostDto } from './dto/job.request.post.dto';
import { JobResponseDto } from './dto/job.response.dto';
import { JobResponseGetDto } from './dto/job.response.get.dto';
import { MessageQueueService } from './message_queue.service';
import { JwtAuthGuard } from '@modules/user_manage/user_manage.guard';
import { JobRequestGetDto } from './dto/job.request.get.dto';
import { JobResponsePostDto } from './dto/job.response.post.dto';
import { JobRequestPutDto } from './dto/job.request.put.dto';
import { JobRequestDeleteDto } from './dto/job.request.delete.dto';

@Controller({
	version: '1',
	path: 'pill-alerts',
})
@ApiTags('알람 등록 API')
export class MessageQueueController {
	constructor(private msgq: MessageQueueService) {}

	@ApiBearerAuth('access-token')
	@ApiOperation({ summary: '오늘의 알람 조회 (메인페이지,캘린더) 구현 완료' })
	@ApiCreatedResponse({ description: '성공', type: JobResponseGetDto })
	@UseGuards(JwtAuthGuard)
	@Get('/')
	async getAlert(
		@Query() requestData: JobRequestGetDto,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const userId = req.user!.userId;
		const result = await this.msgq.getPillAlert(
			requestData.year,
			requestData.month,
			requestData.day,
			userId,
		);
		return res.json(result);
	}

	@ApiBearerAuth('access-token')
	@ApiOperation({ summary: '알람 등록 (알람추가페이지) 구현 완료' })
	@ApiCreatedResponse({ description: '성공', type: JobResponseDto })
	@UseGuards(JwtAuthGuard)
	@Post('/')
	async postAlert(
		@Body(new ValidationPipe()) requestData: JobRequestPostDto,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const userId = req.user!.userId;
		const firebasetoken = req.user!.firebasetoken;
		const saveJob = await this.msgq.postPillAlert(
			requestData.alertTime,
			requestData.isPush,
			requestData.pillName,
			requestData.alertWeek,
			userId,
			firebasetoken,
			requestData.dosage,
		);
		let result: JobResponsePostDto = { result: false };
		if (saveJob) {
			result.result = true;
		}
		return res.json(result);
	}

	@ApiBearerAuth('access-token')
	@ApiOperation({ summary: '알람 수정 (수정페이지)' })
	@ApiCreatedResponse({ description: '성공', type: JobResponseDto })
	@UseGuards(JwtAuthGuard)
	@Put('/:alertId')
	async putAlert(
		@Body(new ValidationPipe()) jobAlertData: JobRequestPostDto,
		@Param() requestPutData: JobRequestPutDto,
		@Req() req: Request,
		@Res() res: Response,
	) {
		let result: JobResponsePostDto = { result: false };
		const userId = req.user!.userId;
		const firebasetoken = req.user!.firebasetoken;
		const removeJob = await this.msgq.completeDeletePillAlert(
			requestPutData.alertId,
		);
		if (!removeJob) {
			return res.json(result);
		}

		const saveJob = await this.msgq.postPillAlert(
			jobAlertData.alertTime,
			jobAlertData.isPush,
			jobAlertData.pillName,
			jobAlertData.alertWeek,
			userId,
			firebasetoken,
			jobAlertData.dosage,
		);
		if (saveJob) {
			result.result = true;
		}
		return res.json(result);
	}

	@ApiBearerAuth('access-token')
	@ApiOperation({ summary: '알람 제거 구현완료' })
	@ApiCreatedResponse({ description: '성공', type: JobResponseDto })
	@ApiParam({ name: 'alertId', required: true, example: '1' })
	@UseGuards(JwtAuthGuard)
	@Delete('/:alertId')
	async removeMsg(
		@Param() requestDeleteData: JobRequestDeleteDto,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const userId = req.user!.userId;
		const result = await this.msgq.softDeletePillAlert(
			userId,
			requestDeleteData.alertId,
		);
		return res.json(result);
	}
}
