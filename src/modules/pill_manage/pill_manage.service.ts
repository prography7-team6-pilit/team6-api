import { Week } from '@modules/message_queue/dto/enums/week.enum';
import { JobResponsePostDto } from '@modules/message_queue/dto/job.response.post.dto';
import { DayTakingLog } from '@modules/repo/entity/day-taking-log.entity';
import { Eat } from '@modules/repo/entity/eat.entity';
import { RepositoryService } from '@modules/repo/repo.service';
import { Injectable } from '@nestjs/common';

import { EatRequestDto } from './dto/eat.request.post.dto';

@Injectable()
export class PillManageService {
	constructor(private readonly repo: RepositoryService) {}

	async getMonthPill(userId: number, year: number, month: number) {
		const week: Date = await this.strTodate(year, month, 1);
		const job = await this.repo.repo_getMonth(userId, week);
		return job;
	}

	async takePill(
		requestDto: EatRequestDto,
		userId: number,
	): Promise<JobResponsePostDto | undefined> {
		const isTaked = await this.repo.isTaked(requestDto.alertId);
		if (!isTaked) {
			const eat: Eat = {
				eatId: 0,
				userId: userId,
				alertId: requestDto.alertId,
				eatDate: new Date(),
			};
			await this.repo.addPill(eat);
			await this.setStatus(userId);
			return { result: true };
		}

		const result = await this.repo.putPill(isTaked.eatId);
		if (result.affected! > 0) {
			await this.setStatus(userId);
			return { result: false };
		}
		// finished TODO: 오늘 요일의 alert-times 조회해서 pillId 뽑고 pill 개수만큼 eat이 있으면 day-taking-log 찍기
		//1. 오늘 요일 alert-times 조회
		//2. pillId 뽑기
		//3. pill 개수만큼 eat이 있는지 확인

		return { result: true };
	}

	async strTodate(year: number, month: number, day: number) {
		const dateDate = new Date(
			`${year}-${month.toString().padStart(2, '0')}-${day
				.toString()
				.padStart(2, '0')}`,
		);
		return dateDate;
	}
	async getTodayWeek(): Promise<number> {
		return new Date().getDay();
	}
	async setStatus(userId: number) {
		/*const todayLogs = await this.repo.repo_getJob(
			userId,
			new Date(),
			Week[await this.getTodayWeek()],
		);

		const todayTakeLogsCount = todayLogs.takeLogs.length;
		const todayWeekJobsCount = todayLogs.weekJob.length;
		let takeStatusCode = 2;

		if (todayTakeLogsCount === 0) {
			takeStatusCode = 0;
		} else if (todayTakeLogsCount < todayWeekJobsCount) {
			takeStatusCode = 1;
		}
		const dayTakingLog: DayTakingLog = {
			id: 0,
			date: new Date(),
			userId: userId,
			takeStatus: takeStatusCode,
		};
		await this.repo.dayTakingLog(dayTakingLog);*/
	}
}
