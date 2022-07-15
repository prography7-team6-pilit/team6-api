import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlertTime } from 'src/entity/alert-time.entity';
import { Repository } from 'typeorm';
import { Week } from './dto/enums/week.enum';

@Injectable()
export class AlertRepository {
	constructor(
		@InjectRepository(AlertTime)
		private alertTimeRepository: Repository<AlertTime>,
	) {}

	async getAlertTimeByDate(
		userId: number,
		year: number,
		month: number,
		day: number,
	): Promise<AlertTime[]> {
		const strDate = `${year}-${month.toString().padStart(2, '0')}-${day
			.toString()
			.padStart(2, '0')}`;
		const date = new Date(strDate);
		const week: Week = await this.dayToweek(date.getDay());
		return await this.alertTimeRepository.find({ week, userId });
	}

	async getAlertTimeByAlertId(pillId: number) {
		return await this.alertTimeRepository.find({ pillId });
	}

	async getWeekByalertId(alertId: number): Promise<Week[]> {
		const alerts = await this.alertTimeRepository.find({ pillId: alertId });
		let result: Week[] = new Array();
		for (const alert of alerts) {
			result.push(alert.week);
		}
		const resultSet = new Set(result);
		return [...resultSet];
	}

	async getAlertTime(pillId: number): Promise<AlertTime[]> {
		return await this.alertTimeRepository.find({
			pillId,
		});
	}

	async saveJobTime(
		week: Week,
		time: string,
		userId: number,
		pillId: number,
		bullId: string,
	): Promise<AlertTime> {
		return await this.alertTimeRepository.save({
			week,
			time,
			userId,
			pillId,
			bullId,
		});
	}

	async insertAlertTime(
		alertId: number,
		bullId: string,
		week: Week,
		time: string,
		userId: number,
	) {
		return await this.alertTimeRepository.save({
			pillId: alertId,
			bullId,
			userId,
			week,
			time,
		});
	}

	async removeAlertTiemByPillId(pillId: number) {
		return await this.alertTimeRepository.delete({ pillId });
	}

	async removeAlertTiemByAlertTimeId(alertTimeId: number) {
		return await this.alertTimeRepository.delete({ alertTimeId });
	}

	async getTodayJob(userId: number, nowDate: Date) {
		const now = this.dayToweek(nowDate.getDay());
		return await this.alertTimeRepository.find({
			week: now,
			userId,
		});
	}

	async getAlerts(pillId: number) {
		return await this.alertTimeRepository.find({ pillId });
	}

	private dayToweek(day: number): Week {
		switch (day) {
			case 0:
				return Week.Sun;
			case 1:
				return Week.Mon;
			case 2:
				return Week.Tue;
			case 3:
				return Week.Wed;
			case 4:
				return Week.Thu;
			case 5:
				return Week.Fri;
			case 6:
				return Week.Sat;
		}
		throw new Error('~~');
	}
}
