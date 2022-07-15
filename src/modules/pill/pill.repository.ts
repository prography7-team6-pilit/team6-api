import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DayTakingLog } from 'src/entity/day-taking-log.entity';
import { Job } from 'src/entity/job.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class PillRepository {
	constructor(
		@InjectRepository(Job)
		private jobRepository: Repository<Job>,
		@InjectRepository(DayTakingLog)
		private dayTakingLogRepository: Repository<DayTakingLog>,
	) {}
	async getInofoByPillId(pillId: number): Promise<Job | void> {
		return await this.jobRepository.findOne({
			alertId: pillId,
			IsRemoved: false,
		});
	}

	async getJob(alertId: number) {
		return await this.jobRepository.findOne({ alertId });
	}
	async updatePill(
		alertId: number,
		isPush: boolean,
		dosage: number,
		pillName: string,
	) {
		return this.jobRepository.update(alertId, {
			isPush,
			dosage,
			pillName,
		});
	}
	async saveJob(
		isPush: boolean,
		firebasetoken: string,
		pillName: string,
		userId: number,
		dosage: number,
	): Promise<{ alertId: number }> {
		const result = await this.jobRepository.save({
			isPush,
			firebasetoken,
			pillName,
			userId,
			dosage,
			IsRemoved: false,
		});
		return { alertId: result.alertId };
	}

	async softDelJob(userId: number, alertId: number): Promise<DeleteResult> {
		return await this.jobRepository.update(
			{ alertId, userId },
			{ IsRemoved: true },
		);
	}
	async getMonthData(userId: number, year: number, month: number) {
		const firstDay = new Date(
			`${year}-${month.toString().padStart(2, '0')}-01`,
		);
		const lastDay = new Date(
			firstDay.getFullYear(),
			firstDay.getMonth() + 1,
			0,
		).toLocaleDateString();
		const statusList = await this.dayTakingLogRepository
			.createQueryBuilder()
			.where('userId=:userId', { userId: userId })
			.andWhere('date >= :from_date', {
				from_date: firstDay,
			})
			.andWhere('date >= :to_date', {
				to_date: lastDay,
			})
			.getMany();

		return statusList;
	}

	async dayTakingLog(userId: number, dayTakingLog: DayTakingLog) {
		const todaydata = await this.dayTakingLogRepository.findOne({
			date: new Date(new Date().toLocaleDateString()),
			userId: userId,
		});
		if (!todaydata) {
			await this.dayTakingLogRepository.save(dayTakingLog);
		}
		await this.dayTakingLogRepository.update(
			{
				date: new Date(new Date().toLocaleDateString()),
				userId: userId,
			},
			{ takeStatus: dayTakingLog.takeStatus },
		);
		return;
	}
}
