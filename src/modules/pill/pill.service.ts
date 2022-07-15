import { AlertRepository } from '@modules/alert/alert.repository';
import { JobResponsePostDto } from '@modules/alert/dto/job.response.post.dto';
import { TakingLogRepository } from '@modules/taking-log/taking-log.repository';
import { Injectable } from '@nestjs/common';
import { DayTakingLog } from 'src/entity/day-taking-log.entity';
import { Eat } from 'src/entity/eat.entity';

import { EatRequestDto } from './dto/eat.request.post.dto';
import { EatResponseMonthDto } from './dto/eat.response.month.dto';
import { EatResponseMonthUnitDto } from './dto/eat.response.month.unit.dto';
import { PillRepository } from './pill.repository';

@Injectable()
export class PillService {
	constructor(
		private readonly pillRepository: PillRepository,
		private readonly takingLogRepository: TakingLogRepository,
		private readonly alertRepository: AlertRepository,
	) {}

	async getMonthPill(userId: number, year: number, month: number) {
		let result: EatResponseMonthDto = { takelogs: [] };
		const monthDatas = await this.pillRepository.getMonthData(
			userId,
			year,
			month,
		);
		monthDatas.forEach((status) => {
			const monthData: EatResponseMonthUnitDto = {
				eatDate: status.date.toString(),
				pillState: status.takeStatus,
			};
			if (status.takeStatus) {
				result.takelogs.push(monthData);
			}
		});
		return result;
	}

	async takePill(
		requestDto: EatRequestDto,
		userId: number,
	): Promise<JobResponsePostDto | undefined> {
		const isTaked = await this.takingLogRepository.isTaked(requestDto.alertId);
		if (!isTaked) {
			const eat: Eat = {
				eatId: 0,
				userId: userId,
				alertId: requestDto.alertId,
				eatDate: new Date(new Date().toLocaleDateString()),
			};
			await this.takingLogRepository.addPill(eat);
			await this.setStatus(userId);
			return { result: true };
		}

		const result = await this.takingLogRepository.putPill(isTaked.eatId);
		if (result.affected! > 0) {
			await this.setStatus(userId);
			return { result: false };
		}
		return { result: true };
	}
	async setStatus(userId: number): Promise<boolean> {
		const now = new Date();
		const nowDate = new Date(now.toLocaleDateString());
		const todayLogs = await this.alertRepository.getTodayJob(userId, nowDate);
		const eatLogs = await this.takingLogRepository.getTakeOrNotByDay(
			userId,
			nowDate,
		);
		const todayLogsCount = todayLogs.length;
		const eatLogsCount = eatLogs.length;
		let takeStatusCode = 2;
		if (eatLogsCount === 0) {
			takeStatusCode = 0;
		} else if (todayLogsCount > eatLogsCount) {
			takeStatusCode = 1;
		}

		const dayTakingLog: DayTakingLog = {
			id: 0,
			date: new Date(new Date().toLocaleDateString()),
			userId: userId,
			takeStatus: takeStatusCode,
		};

		const result = await this.pillRepository.dayTakingLog(userId, dayTakingLog);
		return true;
	}
}
