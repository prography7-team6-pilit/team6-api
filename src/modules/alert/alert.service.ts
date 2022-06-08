import { Week } from '@modules/message_queue/dto/enums/week.enum';
import { AlertTime } from '@modules/repo/entity/alert-time.entity';
import { Job } from '@modules/repo/entity/job.entity';
import { InjectQueue } from '@nestjs/bull';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Bull, { Queue } from 'bull';
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
		const alertId = await this.getAlertIdByAlertTime(weekday, time, userId);
		let pills = [{ name: pillName, pillId }];
		if (alertId) {
			this.alertQueue.getJob(alertId).then((job) => {
				job?.update({
					firebaseToken,
					pills: [...pills, ...job.data.pills],
				});
			});
			return { alertId: `${alertId}` };
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

	async removeOne(alertId: Bull.JobId, pillId: number, firebaseToken: string) {
		this.alertQueue.getJob(alertId).then(async (job) => {
			const pillData = job!.data.pills;
			const idx = pillData.findIndex(function (item) {
				return item.pillId === pillId;
			});
			if (idx > -1) {
				pillData.splice(idx, 1);
			}
			if (pillData == null) {
				await job!.remove();
			} else {
				await job!.update({
					firebaseToken,
					pills: [...pillData],
				});
			}
		});
	}

	private async getAlertIdByAlertTime(
		weekday: Week,
		time: string,
		userId: number,
	): Promise<Bull.JobId | void> {
		const alertTime = await this.alertTimeRepository.findOne({
			week: weekday,
			time,
			userId,
		});
		if (!alertTime) {
			return;
		}
		const pill = await this.pillRepository.findOne({
			alertId: alertTime.pillId,
			userId,
		});
		if (!pill) {
			return;
		}
		return pill.bullId;
	}

	private timeToCron(week: Week, time: string): string {
		const hourMinute = time.split(':');

		const cron = `0 ${hourMinute[1]} ${hourMinute[0]} * * ${week}`;
		return cron;
	}
}
