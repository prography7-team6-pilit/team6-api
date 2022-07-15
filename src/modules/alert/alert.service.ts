import { AlertBullService } from '@modules/alert-bull';
import { PillRepository } from '@modules/pill/pill.repository';
import { TakingLogRepository } from '@modules/taking-log/taking-log.repository';
import { HttpException, Injectable } from '@nestjs/common';
import { AlertRepository } from './alert.repository';
import { Week } from './dto/enums/week.enum';
import { JobResponseDto } from './dto/job.response.dto';
import { JobResponseGetDto } from './dto/job.response.get.dto';
import { JobResponseUnitGetDto } from './dto/job.response.get.unit.dto';

@Injectable()
export class AlertService {
	constructor(
		private alertBullService: AlertBullService,
		private alertRepository: AlertRepository,
		private pillRepository: PillRepository,
		private takinglogRepository: TakingLogRepository,
	) {}

	async getPillAlert(
		year: number,
		month: number,
		day: number,
		userId: number,
	): Promise<JobResponseGetDto | void> {
		const alerts = [];
		const todayJobTimes = await this.alertRepository.getAlertTimeByDate(
			userId,
			year,
			month,
			day,
		);
		for (const element of todayJobTimes) {
			const alertIndex = alerts.findIndex(function (item) {
				return item.alertId === element.pillId;
			});
			if (alertIndex >= 0) {
				const alert = alerts[alertIndex];
				if (alert.alertWeek.indexOf(Week[element.week]) < 0) {
					alert.alertWeek.push(element.week);
				}
				alert.alertTime.push(element.time);
				continue;
			}
			const getWeek = await this.alertRepository.getWeekByalertId(
				element.pillId,
			);
			const todayJobInfos = await this.pillRepository.getInofoByPillId(
				element.pillId,
			);
			if (!todayJobInfos) {
				continue;
			}
			const eatInfo = await this.takinglogRepository.getTakeOrNot(
				userId,
				element.pillId,
				year,
				month,
				day,
			);
			const alert: JobResponseUnitGetDto = {
				alertId: todayJobInfos.alertId,
				alertTime: [element.time],
				alertWeek: getWeek,
				isPush: todayJobInfos.isPush,
				pillName: todayJobInfos.pillName,
				dosage: todayJobInfos.dosage,
				eatResult: false,
			};
			if (eatInfo) {
				alert.eatResult = true;
			}
			alerts.push(alert);
		}
		return { alerts };
	}

	async insertPillAlert(
		alertTime: string[],
		isPush: boolean,
		pillName: string,
		alertWeek: Week[],
		userId: number,
		firebasetoken: string,
		dosage: number,
	): Promise<boolean> {
		const infoData = await this.pillRepository.saveJob(
			isPush,
			firebasetoken,
			pillName,
			userId,
			dosage,
		);
		for (const week of alertWeek) {
			for (const time of alertTime) {
				if (isPush) {
					const alert = await this.alertBullService.create({
						pillName: pillName,
						firebaseToken: firebasetoken,
						weekday: week,
						time: time,
						userId: userId,
						pillId: infoData.alertId,
					});
					await this.alertRepository.saveJobTime(
						week,
						time,
						userId,
						infoData.alertId,
						alert.alertId,
					);
					continue;
				}
				await this.alertRepository.saveJobTime(
					week,
					time,
					userId,
					infoData.alertId,
					'',
				);
			}
		}
		return true;
	}
	async removeAllJob(alertId: number) {
		const alertTimes = await this.alertRepository.getAlertTime(alertId);
		if (!alertTimes) {
			return;
		}
		for (const alertTime of alertTimes) {
			await this.alertBullService.removeJob(alertTime.bullId, alertId);
			await this.alertRepository.removeAlertTiemByAlertTimeId(
				alertTime.alertTimeId,
			);
		}
	}
	async putJob(
		dosage: number,
		isPush: boolean,
		pillName: string,
		alertId: number,
	) {
		const job = await this.pillRepository.getJob(alertId);
		if (!job) {
			throw new HttpException('해당 알림이 존재하지 않습니다.', 400);
		}
		const result = await this.pillRepository.updatePill(
			alertId,
			isPush,
			dosage,
			pillName,
		);
		return result;
	}
	async updateAlertTime(
		alertId: number,
		alertWeek: Week[],
		alertTime: string[],
		userId: number,
		firebaseToken: string,
		pillName: string,
		isPush: boolean,
	) {
		const alertTimes = await this.alertRepository.getAlertTimeByAlertId(
			alertId,
		);
		if (!alertTimes) {
			throw new HttpException('해당 알람이 없습니다.', 400);
		}

		for (const time of alertTime) {
			for (const week of alertWeek) {
				if (!isPush) {
					continue;
				}
				const alertTime = await this.alertBullService.create({
					pillId: alertId,
					firebaseToken: firebaseToken,
					weekday: week,
					time: time,
					userId: userId,
					pillName: pillName,
				});

				await this.alertRepository.insertAlertTime(
					alertId,
					alertTime.alertId,
					week,
					time,
					userId,
				);
			}
		}
		return alertTime;
	}

	async softDeletePillAlert(
		userId: number,
		alertId: number,
	): Promise<JobResponseDto> {
		const alertTimes = await this.alertRepository.getAlerts(alertId);
		for (const alertTime of alertTimes) {
			await this.alertBullService.removeJob(alertTime.bullId, alertTime.pillId);
		}
		await this.alertRepository.removeAlertTiemByPillId(alertId);
		const data = await this.pillRepository.softDelJob(userId, alertId);
		return { result: Boolean(data) };
	}
}
