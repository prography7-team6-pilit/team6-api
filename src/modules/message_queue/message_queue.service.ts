import { AlertService, CreateAlertParams } from '@modules/alert';
import { RepositoryService } from '@modules/repo/repo.service';
import { Injectable } from '@nestjs/common';
import { Week } from './dto/enums/week.enum';
import { JobResponseDto } from './dto/job.response.dto';
import { JobResponseGetDto } from './dto/job.response.get.dto';
import { JobResponseUnitGetDto } from './dto/job.response.get.unit.dto';

@Injectable()
export class MessageQueueService {
	constructor(
		private repo: RepositoryService,
		private alertService: AlertService,
	) {}

	async getPillAlert(
		year: number,
		month: number,
		day: number,
		userId: number,
	): Promise<JobResponseGetDto | void> {
		let result: JobResponseGetDto = { alerts: [] };
		const todayJobTimes = await this.repo.getJobByDay(userId, year, month, day);
		for (const element of todayJobTimes) {
			/* 아래 코드 실행시 시간배열, 요일 모두 배열로 출력
			const alertIndex = result.alerts.findIndex(function (item, i) {
				return item.alertId === element.pillId;
			});
			if (alertIndex >= 0) {
				const alert = result.alerts[alertIndex];
				if (alert.alertWeek.indexOf(Week[element.week]) < 0) {
					alert.alertWeek.push(element.week);
				}
				alert.alertTime.push(element.time);
				continue;
			}*/
			const getWeek = await this.repo.getWeekByalertId(element.pillId);
			const todayJobInfos = await this.repo.getInofoByPillId(element.pillId);
			if (!todayJobInfos) {
				continue;
			}
			const eatInfo = await this.repo.getTakeOrNot(
				userId,
				element.alertTimeId,
				year,
				month,
				day,
			);
			let alert: JobResponseUnitGetDto = {
				alertId: todayJobInfos.alertId,
				alertTime: [element.time],
				alertWeek: getWeek,
				isPush: todayJobInfos.isPush,
				pillName: todayJobInfos.pillName,
				dosage: todayJobInfos.dosage,
				alertTimeId: element.alertTimeId,
				eatResult: false,
			};
			if (eatInfo) {
				alert.eatResult = true;
			}
			result.alerts.push(alert);
		}
		return result;
	}

	async postPillAlert(
		alertTime: string[],
		isPush: boolean,
		pillName: string,
		alertWeek: Week[],
		userId: number,
		firebasetoken: string,
		dosage: number,
	): Promise<Boolean> {
		const infoData = await this.repo.repo_saveJobInfo(
			isPush,
			'0',
			firebasetoken,
			pillName,
			userId,
			dosage,
		);
		for (const week of alertWeek) {
			for (const time of alertTime) {
				const createAlert: CreateAlertParams = {
					pillName: pillName,
					firebaseToken: firebasetoken,
					weekday: week,
					time: time,
					userId: userId,
					pillId: infoData.alertId,
				};
				if (isPush === true) {
					const bullId = await this.alertService.create(createAlert);
					await this.repo.repo_updateJobAlertId(
						infoData.alertId,
						bullId.alertId,
					);
				}
				const saveTime = await this.repo.repo_saveJobTime(
					week,
					time,
					userId,
					infoData.alertId,
				);
			}
		}
		return true;
	}
	async completeDeletePillAlert(alertId: number): Promise<boolean> {
		const jobId = await this.repo.getbullidByalertId(alertId);
		// todo await this.alertService.remove(jobId);
		if (!jobId) {
			return false;
		}
		const removeJob = await this.repo.completeRemoveJob(alertId);
		if (!removeJob) {
			return false;
		}
		const removeAlert = await this.repo.completeRemoveAlert(alertId);
		if (!removeAlert) {
			return false;
		}
		return true;
	}

	async softDeletePillAlert(
		userId: number,
		alertId: number,
	): Promise<JobResponseDto> {
		const job = await this.repo.getbullidByalertId(alertId);
		await this.alertService.removeOne(alertId, job.alertId, job.firebasetoken);
		const data = await this.repo.softDelJob(userId, alertId);
		if (data) {
			return { result: true };
		} else {
			return { result: false };
		}
	}
}
