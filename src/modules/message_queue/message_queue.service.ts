import { Eat } from '@modules/repo/entity/eat.entity';
import { Job } from '@modules/repo/entity/job.entity';
import { RepositoryService } from '@modules/repo/repo.service';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bull';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Week } from './dto/enums/week.enum';
import { JobRequestPostDto } from './dto/job.request.post.dto';
import { JobResponseDto } from './dto/job.response.dto';
import { JobResponseGetDto } from './dto/job.response.get.dto';
import { JobResponseUnitGetDto } from './dto/job.response.get.unit.dto';

@Injectable()
export class MessageQueueService {
	//implements OnModuleDestroy{
	constructor(
		/*@InjectQueue('message') private msgq:Queue,*/ private repo: RepositoryService,
	) {}

	async getPillAlert(
		year: number,
		month: number,
		day: number,
		userId: number,
	): Promise<JobResponseGetDto | undefined> {
		//작업목록 불러오기
		const date: Date = await this.strTodate(year, month, day);
		const strWeek = Week[date.getDay()];
		const { weekJob, takeLogs } = await this.repo.repo_getJob(
			userId,
			date,
			strWeek,
		);
		const result: JobResponseGetDto = { alerts: [] };
		weekJob.forEach((weekJob) => {
			let arr = [];
			if (weekJob.job_Mon == true) {
				arr.push('Mon');
			}
			if (weekJob.job_Tue == true) {
				arr.push('Tue');
			}
			if (weekJob.job_Wed == true) {
				arr.push('Wed');
			}
			if (weekJob.job_Thu == true) {
				arr.push('Thu');
			}
			if (weekJob.job_Fri == true) {
				arr.push('Fri');
			}
			if (weekJob.job_Sat == true) {
				arr.push('Sat');
			}
			if (weekJob.job_Sun == true) {
				arr.push('Sun');
			}

			weekJob.eat_eatId = 0;
			weekJob.eat_eatResult = false;

			takeLogs.forEach((log) => {
				if (weekJob.job_alertId === log.alertId) {
					weekJob.eat_eatId = log.eat_eatId;
					weekJob.eat_eatResult = true;
				}
			});

			let response: JobResponseUnitGetDto = {
				alertId: weekJob.job_alertId,
				alertTime: weekJob.job_alertTime,
				alertWeek: arr,
				isPush: Boolean(weekJob.job_isPush),
				pillName: weekJob.job_pillName,
				eatId: weekJob.eat_eatId,
				eatResult: weekJob.eat_eatResult,
				dosage: weekJob.job_dosage,
			};
			result.alerts.push(response);
		});
		return result;
	}

	async postPillAlert(
		userId: number,
		firebasetoken: string,
		requestData: JobRequestPostDto,
	): Promise<Job> {
		// const job=await this.msgq.add('transcode',{
		//     userId,
		//     firebasetoken,
		//     jobDto
		// },
		// {
		//     repeat: { cron: "*/1 * * * *" }
		// });
		// const bullId = job.id.toString();
		const bullId = '1';
		//--------------------------------

		const jobEntity: Job = {
			alertId: 0,
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
		const saveJob = await this.repo.repo_saveJob(jobEntity); //res.user 의 userId 가져오기
		return saveJob;
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

		const jobEntity: Job = {
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
		return putJob;
	}

	async deletePillAlert(alertId: number): Promise<JobResponseDto> {
		const data = await this.repo.repo_delJob(alertId);
		if (data) {
			return { result: true };
		} else {
			return { result: false };
		}
	}

	/*async onModuleDestroy() {
        await this.msgq.close();
    }*/

	async strTodate(year: number, month: number, day: number) {
		const strDate =
			year +
			'-' +
			month.toString().padStart(2, '0') +
			'-' +
			day.toString().padStart(2, '0');
		const dateDate = new Date(strDate);
		return dateDate;
	}
}
