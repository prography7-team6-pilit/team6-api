import { Week } from '@modules/alert/dto/enums/week.enum';
import { InjectQueue } from '@nestjs/bull';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Bull, { Queue } from 'bull';
import { AlertTime } from 'src/entity/alert-time.entity';
import { Repository } from 'typeorm';

import { AlertDto } from '../../core/types';

export type CreateAlertParams = {
	pillName: string;
	firebaseToken: string;
	weekday: Week;
	userId: number;
	pillId: number;
	time: string;
};
export interface UpdateAlertParams extends CreateAlertParams {
	alertId: string;
}

@Injectable()
export class AlertBullService {
	constructor(
		@InjectRepository(AlertTime)
		private readonly alertTimeRepository: Repository<AlertTime>,
		@InjectQueue('message') private alertQueue: Queue<AlertDto>,
	) {}

	async create({
		pillName,
		firebaseToken,
		weekday,
		time,
		userId,
		pillId,
	}: CreateAlertParams): Promise<{ alertId: string }> {
		let pills = [{ name: pillName, pillId: pillId }];
		const bullId = await this.getBullIdByAlertTime(weekday, time, userId);
		if (bullId) {
			await this.alertQueue.getJob(bullId).then(async (job) => {
				if (!job) {
					throw new HttpException('서버 초기화가 필요합니다', 500);
				}
				let pillData = job!.data.pills;
				pillData.push({ name: pillName, pillId: pillId });
				await job!.update({
					firebaseToken,
					pills: [...pillData],
				});
			});
			return { alertId: `${bullId}` };
		}
		const alert = await this.alertQueue.add(
			{
				firebaseToken,
				pills: pills,
			},
			{
				repeat: { cron: this.timeToCron(weekday, time) },
			},
		);
		return { alertId: `${alert.id}` };
	}

	async removeJob(bullId: Bull.JobId, pillId: number) {
		await this.alertQueue.getJob(bullId).then(async (job) => {
			const pillData = job!.data.pills;
			const firebaseToken = job!.data.firebaseToken;
			const idx = pillData.findIndex(function (item) {
				return item.pillId === pillId;
			});
			if (idx > -1) {
				pillData.splice(idx, 1);
			}
			if (pillData.length == 0) {
				await job!.remove();
			} else {
				await job!.update({
					firebaseToken,
					pills: [...pillData],
				});
			}
		});
	}
	async removeAllJob() {
		const jobs = await this.alertQueue.getJobs([
			'active',
			'waiting',
			'delayed',
			'completed',
		]);
		for (const job of jobs) {
			await job.remove();
		}
		const afterRemoveJobs = await this.alertQueue.getJobs([
			'active',
			'waiting',
			'delayed',
			'completed',
		]);
		return `BeforeRemove ---- ${jobs}\nAfterRemove ---- ${afterRemoveJobs}`;
	}

	private async getBullIdByAlertTime(
		weekday: Week,
		time: string,
		userId: number,
	) {
		const alertTime = await this.alertTimeRepository.findOne({
			week: weekday,
			time,
			userId,
		});
		if (!alertTime) {
			return;
		}
		return alertTime.bullId;
	}

	private timeToCron(week: Week, time: string): string {
		const hourMinute = time.split(':');
		return `0 ${hourMinute[1]} ${hourMinute[0]} * * ${week}`;
	}
}
