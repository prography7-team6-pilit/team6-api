import { AllExceptionFilter } from '@modules/http-exception.filter.ts';
import { Week } from '@modules/message_queue/dto/enums/week.enum';
import { Injectable, UseFilters } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { query } from 'express';
import {
	Brackets,
	DeleteResult,
	getConnection,
	getRepository,
	Repository,
	UpdateResult,
} from 'typeorm';
import { AlertTime } from './entity/alert-time.entity';
import { DayTakingLog } from './entity/day-taking-log.entity';
import { Eat } from './entity/eat.entity';
import { Job } from './entity/job.entity';
import { User } from './entity/user.entity';

@UseFilters(AllExceptionFilter)
@Injectable()
export class RepositoryService {
	constructor(
		@InjectRepository(Job) private jobRepository: Repository<Job>,
		@InjectRepository(User) private userRepository: Repository<User>,
		@InjectRepository(Eat) private eatRepository: Repository<Eat>,
		@InjectRepository(AlertTime)
		private alertTimeRepository: Repository<AlertTime>,
		@InjectRepository(DayTakingLog)
		private dayTakingLogRepository: Repository<DayTakingLog>,
	) {}

	async getJogByDay(
		userId: number,
		year: number,
		month: number,
		day: number,
	): Promise<AlertTime[]> {
		const date: Date = await this.strTodate(year, month, day);
		const weekNum = Week[date.getDay()];
		const jobTime = await getRepository(AlertTime)
			.createQueryBuilder('alerttime')
			.where('week=:week', { week: weekNum })
			.andWhere('userId=:userId', { userId: userId })
			.getMany();
		return jobTime;
	}
	async getInofoByPillId(pillId: number): Promise<Job> {
		const jobInfo = await this.jobRepository.findOneOrFail({
			alertId: pillId,
			IsRemoved: false,
		});
		return jobInfo;
	}
	async getTakeOrNot(
		userId: number,
		alertId: number,
		year: number,
		month: number,
		day: number,
	) {
		const date: Date = await this.strTodate(year, month, day);
		const from_date = new Date(date).toISOString();
		const to_date = new Date(date.setDate(date.getDate() + 1)).toISOString();
		const takeLogs = await getRepository(Eat)
			.createQueryBuilder()
			.where('userId=:userId', { userId: userId })
			.andWhere('alertId=:alertId', { alertId: alertId })
			.andWhere(
				new Brackets((qb) => {
					qb.where('eatDate >= :from_date', {
						from_date: from_date,
					}).andWhere('eatDate < :to_date', { to_date: to_date });
				}),
			)
			.getOne();
		return takeLogs;
	}

	async repo_saveJobInfo(
		isPush: boolean,
		bullId: string,
		firebasetoken: string,
		pillName: string,
		userId: number,
		dosage: number,
	): Promise<{ alertId: number }> {
		const data = await this.jobRepository.create({
			isPush,
			bullId,
			firebasetoken,
			pillName,
			userId,
			dosage,
			IsRemoved: false,
		});
		const result = await this.jobRepository.save(data);
		return { alertId: result.alertId };
	}
	async repo_saveJobTime(
		week: number,
		time: string,
		userId: number,
		pillId: number,
	): Promise<AlertTime> {
		const data = await this.alertTimeRepository.create({
			week,
			time,
			userId,
			pillId,
		});
		const result = await this.alertTimeRepository.save(data);
		return result;
	}

	async repo_updateJobAlertId(alertId: number, bullId: string) {
		await getConnection()
			.createQueryBuilder()
			.update(Job)
			.set({ bullId: bullId })
			.where('alertId = :id', { id: alertId })
			.execute();
	}

	async repo_putJob(alertId: number, job: Job) {
		// await getConnection().getRepository(Job).save(job)
		const result = await getConnection()
			.createQueryBuilder()
			.update(Job)
			.set({
				alertId: alertId,
				/*alertTime: job.alertTime,
				isPush: job.isPush,
				userId: job.userId,
				bullId: job.bullId,
				pillName: job.pillName,
				Mon: job.Mon,
				Tue: job.Tue,
				Wed: job.Wed,
				Thu: job.Thu,
				Fri: job.Fri,
				Sat: job.Sat,
				Sun: job.Sun,*/
				dosage: job.dosage,
			})
			.where('alertId = :alertId', { alertId: alertId })
			.execute();
		return result;
	}

	async repo_delJob(userId: number, alertId: number): Promise<DeleteResult> {
		const job = await getConnection()
			.getRepository(Job)
			.createQueryBuilder('job')
			.update(Job)
			.set({ IsRemoved: true })
			.where('alertId = :alertId', { alertId: alertId })
			.andWhere('userId = :userId', { userId: userId })
			.execute();
		return job;
	}
	async getBullIdByalertId(alertId: number): Promise<string> {
		const id = await this.jobRepository.findOneOrFail({ alertId: alertId });
		return id.bullId;
	}
	//--------------------------------------------------------------

	async getNickname(uuid: string): Promise<User | undefined> {
		const nickname = await this.userRepository.findOne({ uuid: uuid });
		return nickname;
	}

	async setNickname(userEntity: User): Promise<User> {
		const result = await this.userRepository.save(userEntity);
		return result;
	}
	//--------------------------------------------------------------

	async repo_getMonth(userId: number, date: Date) {
		// TODO: day-taking-log 뽑아서 리턴
		const from_date = date;
		const to_date = new Date(date.setDate(date.getMonth() + 1));
		const db = await getConnection();
		const jobLists = await db
			.getRepository(Job)
			.createQueryBuilder('job')
			.leftJoinAndMapMany('job.eatId', Eat, 'eat', 'eat.alertId = job.alertId')
			.where('eatId=')
			.andWhere('eat.eatDate >= :from_date', {
				from_date: from_date,
			})
			.andWhere('eat.eatDate >= :to_date', {
				to_date: to_date,
			})
			.getMany();
	}
	async addPill(eat: Eat) {
		const result = await this.eatRepository.save(eat);
		return result;
	}

	// camel
	async putPill(eatId: number): Promise<DeleteResult> {
		const result = await getConnection()
			.createQueryBuilder()
			.delete()
			.from(Eat)
			.where('eatId = :eatId', { eatId: eatId })
			.execute();
		return result;
	}

	async isTaked(alertId: number): Promise<Eat> {
		const now_data = new Date();
		const from_date = now_data;
		const to_date = new Date(now_data.setDate(now_data.getMonth() + 1));
		const logCheck = await getRepository(Eat)
			.createQueryBuilder('eat')
			.andWhere('eat.alertId=:alertId', { alertId: alertId })
			.andWhere('eat.eatDate >= :from_date', {
				from_date: from_date,
			})
			.andWhere('eat.eatDate >= :to_date', {
				to_date: to_date,
			})
			.getOneOrFail();
		return logCheck;
	}

	async getAlertTimes(week: Week, userId: number) {
		const result = this.alertTimeRepository.find({
			week: week,
			userId: userId,
		});
		return result;
	}
	async dayTakingLog(dayTakingLog: DayTakingLog) {
		await this.dayTakingLogRepository.save(dayTakingLog);
	}

	////////////////////////////////////////////
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
