import { Week } from '@modules/message_queue/dto/enums/week.enum';
import { AlertTime } from '@modules/repo/entity/alert-time.entity';
import { Job } from '@modules/repo/entity/job.entity';
import { InjectQueue } from '@nestjs/bull';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Bull, { Queue } from 'bull';
import { getConnection, Repository } from 'typeorm';

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
export class AlertService {
	constructor(
		@InjectRepository(AlertTime)
		private readonly alertTimeRepository: Repository<AlertTime>,
		@InjectRepository(Job)
		private readonly pillRepository: Repository<Job>,
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

	async removeOne(bullId: Bull.JobId, pillId: number) {
		this.alertQueue.getJob(bullId).then(async (job) => {
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
		const cron = `0 ${hourMinute[1]} ${hourMinute[0]} * * ${week}`;
		return cron;
	}
}
