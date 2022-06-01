import { JobResponsePostDto } from '@modules/message_queue/dto/job.response.post.dto';
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
	): Promise<JobResponsePostDto | undefined> {
		const isTaked = await this.repo.isTaked(requestDto.alertId);
		if (!isTaked) {
			const eat: Eat = {
				eatId: 0,
				alertId: requestDto.alertId,
				eatDate: new Date(),
			};
			await this.repo.addPill(eat);
			return { result: true };
		}

		const result = await this.repo.putPill(isTaked.eat_eatId);
		if (result.affected! > 0) {
			return { result: false };
		}
		// TODO: 오늘 요일의 alert-times 조회해서 pillId 뽑고 pill 개수만큼 eat이 있으면 day-taking-log 찍기

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
}
