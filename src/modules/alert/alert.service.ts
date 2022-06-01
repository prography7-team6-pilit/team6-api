import { Week } from '@modules/message_queue/dto/enums/week.enum';
import { AlertTime } from '@modules/repo/entity/alert-time.entity';
import { Job } from '@modules/repo/entity/job.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export type CreateAlertParams = {
	pillName: string;
	firebaseToken: string;
	weekday: Week;
	userId: number;
	time: string;
};

@Injectable()
export class AlertService {
	constructor(
		@InjectRepository(AlertTime)
		private readonly alertTimeRepository: Repository<AlertTime>,
		private readonly pillRepository: Repository<Job>,
	) {}

	async create({
		pillName,
		firebaseToken,
		weekday,
		time,
		userId,
	}: CreateAlertParams) {
		const alertId = await this.getAlertIdByAlertTime(weekday, time, userId);
		if (alertId) {
			// 알럿 조회해서 업데이트
			return;
		}
		// 생성
		// const job=await this.msgq.add('transcode',{
		//     userId,
		//     firebasetoken,
		//     jobDto
		// },
		// {
		//     repeat: { cron: "*/1 * * * *" }
		// });
		// const bullId = job.id.toString();
		// const bullId = '1';
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
