import { Week } from '@modules/message_queue/dto/enums/week.enum';
import { AlertTime } from '@modules/repo/entity/alert-time.entity';
import { Job } from '@modules/repo/entity/job.entity';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
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
		if (alertId) {
			// TODO: 틀알럿 조회해서 업데이트 -> pills에 추가해서 업데이트
			return { alertId: '1' };
		}

		const alert = await this.alertQueue.add({
			firebaseToken,
			pills: [
				{
					name: pillName,
					pillId,
				},
			],
		});
		return { alertId: `${alert.id}` };
	}

	async update({}: UpdateAlertParams): Promise<void> {
		// 1. 기존 alert 조회하고 pills에서 삭제
		// 2. this.create(...)
	}

	private async getAlertIdByAlertTime(
		weekday: Week,
		time: string,
		userId: number,
	): Promise<string | void> {
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
		return '';
	}
}
