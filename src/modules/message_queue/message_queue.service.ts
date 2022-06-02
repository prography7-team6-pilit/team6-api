import { AlertService, CreateAlertParams } from '@modules/alert';
import { Eat } from '@modules/repo/entity/eat.entity';
import { Job } from '@modules/repo/entity/job.entity';
import { RepositoryService } from '@modules/repo/repo.service';
import { InjectQueue } from '@nestjs/bull';
import { ConsoleLogger, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bull';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Week } from './dto/enums/week.enum';
import { JobRequestPostDto } from './dto/job.request.post.dto';
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
	): Promise<JobResponseGetDto | undefined> {
		const result: JobResponseGetDto = { alerts: [] };
		const todayJobTimes = await this.repo.getJogByDay(userId, year, month, day);
		let checkingArr = new Array();
		for (const element of todayJobTimes) {
			if (checkingArr.indexOf(element.pillId) >= 0) {
				for (const id of result.alerts) {
					if (id.alertId == element.pillId) {
						id.alertTime.push(element.time);
					}
					if (id.alertWeek.indexOf(Week[element.week]) < 0) {
						id.alertWeek.push(Week[element.week]);
					}
				}
				continue;
			}
			checkingArr.push(element.pillId);
			const todayJobInfos = await this.repo.getInofoByPillId(element.pillId);
			const eatInfo = await this.repo.getTakeOrNot(
				userId,
				element.pillId,
				year,
				month,
				day,
			);
			let alert: JobResponseUnitGetDto = {
				alertId: todayJobInfos.alertId,
				alertTime: [element.time],
				alertWeek: [Week[element.week]],
				isPush: todayJobInfos.isPush,
				pillName: todayJobInfos.pillName,
				dosage: todayJobInfos.dosage,
				eatId: 0,
				eatResult: false,
			};
			if (eatInfo) {
				alert.eatId = eatInfo.eatId;
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
			'1',
			firebasetoken,
			pillName,
			userId,
			dosage,
		);
		for (const week of alertWeek) {
			for (const time of alertTime) {
				const saveTime = await this.repo.repo_saveJobTime(
					week,
					time,
					userId,
					infoData.alertId,
				);
				const createAlert: CreateAlertParams = {
					pillName: pillName,
					firebaseToken: firebasetoken,
					weekday: week,
					time: time,
					userId: userId,
					pillId: infoData.alertId,
				};
				const bullId = await this.alertService.create(createAlert);
				await this.repo.repo_updateJobAlertId(infoData.alertId, bullId.alertId);
			}
		}
		return true;
	}
	async putPillAlert(
		userId: number,
		firebasetoken: string,
		alertId: number,
		requestData: JobRequestPostDto,
	): Promise<UpdateResult | undefined | any> {
		//job 지웠다가 재생성하여 bullId에 값 입력하기
		const bullId = '1';
		//--------------------------------

		/*const jobEntity: Job = {
			alertId: alertId,
			alertTime: requestData.alertTime,
			isPush: requestData.isPush,
			userId: userId,
			bullId: bullId,
			pillName: requestData.pillName,
			Mon: false,
			Tue: false,
			Wed: false,
			Thu: false,
			Fri: false,
			Sat: false,
			Sun: false,
			eat: [],
			firebasetoken: firebasetoken,
			IsRemoved: false,
			dosage: requestData.dosage,
		};

		requestData.alertWeek.forEach((element) => {
			switch (element) {
				case 'Mon':
					jobEntity.Mon = true;
					break;
				case 'Tue':
					jobEntity.Tue = true;
					break;
				case 'Wed':
					jobEntity.Wed = true;
					break;
				case 'Thu':
					jobEntity.Thu = true;
					break;
				case 'Fri':
					jobEntity.Fri = true;
					break;
				case 'Sat':
					jobEntity.Sat = true;
					break;
				case 'Sun':
					jobEntity.Sun = true;
					break;
			}
		});
		const putJob = await this.repo.repo_putJob(alertId, jobEntity); //res.user 의 userId 가져오기
		return putJob;*/
		return;
	}

	async deletePillAlert(
		userId: number,
		alertId: number,
	): Promise<JobResponseDto> {
		const jobId = await this.repo.getBullIdByalertId(alertId);
		await this.alertService.remove(jobId);
		const data = await this.repo.repo_delJob(userId, alertId);
		if (data) {
			return { result: true };
		} else {
			return { result: false };
		}
	}
}
