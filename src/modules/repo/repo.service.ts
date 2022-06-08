import { Week } from '@modules/message_queue/dto/enums/week.enum';
import { ConsoleLogger, Injectable, UseFilters } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { query } from 'express';
import {
	Brackets,
	DeleteResult,
	getConnection,
	getRepository,
	Repository,
} from 'typeorm';
import { AlertTime } from './entity/alert-time.entity';
import { DayTakingLog } from './entity/day-taking-log.entity';
import { Eat } from './entity/eat.entity';
import { Job } from './entity/job.entity';
import { User } from './entity/user.entity';

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

	async getJobByDay(
		userId: number,
		year: number,
		month: number,
		day: number,
	): Promise<AlertTime[]> {
		const strDate = `${year}-${month.toString().padStart(2, '0')}-${day
			.toString()
			.padStart(2, '0')}`;
		const date = new Date(strDate);
		const weekNum: Week = await this.dayToweek(date.getDay());
		const jobTime = await getRepository(AlertTime)
			.createQueryBuilder('alerttime')
			.where('week=:week', { week: weekNum })
			.andWhere('userId=:userId', { userId: userId })
			.getMany();
		return jobTime;
	}
	async getInofoByPillId(pillId: number): Promise<Job | void> {
		const jobInfo = await this.jobRepository.findOne({
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
		const takeLogs = await getRepository(Eat).findOne({
			userId: userId,
			alertId: alertId,
			eatDate: `${year}-${month}-${day}`,
		});
		return takeLogs;
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
	async getTakeOrNotByDay(userId: number, onlyDate: Date): Promise<Eat[]> {
		const result = await this.eatRepository.find({
			userId: userId,
			eatDate: onlyDate,
		});
		return result;
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
		week: Week,
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

	async softDelJob(userId: number, alertId: number): Promise<DeleteResult> {
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
	async completeRemoveJob(alertId: number): Promise<boolean> {
		const deleteJob = await this.jobRepository.delete({ alertId: alertId });
		if (!deleteJob) {
			return false;
		}
		return true;
	}
	async completeRemoveAlert(alertId: number): Promise<boolean> {
		const deleteAlert = await this.alertTimeRepository.delete({
			pillId: alertId,
		});
		if (!deleteAlert) {
			return false;
		}
		return true;
	}
	async getbullidByalertId(alertId: number): Promise<Job> {
		const id = await this.jobRepository.findOneOrFail({
			alertId: alertId,
		});
		return id;
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

	async getMonthData(userId: number, year: number, month: number) {
		// TODO: day-taking-log 뽑아서 리턴
		const firstDay = new Date(
			`${year}-${month.toString().padStart(2, '0')}-01`,
		);
		const lastDay = new Date(
			firstDay.getFullYear(),
			firstDay.getMonth() + 1,
			0,
		).toLocaleDateString();
		const statusList = await getConnection()
			.getRepository(DayTakingLog)
			.createQueryBuilder()
			.where('userId=:userId', { userId: userId })
			.andWhere('date >= :from_date', {
				from_date: firstDay,
			})
			.andWhere('date >= :to_date', {
				to_date: lastDay,
			})
			.getMany();

		return statusList;
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

	async isTaked(alertId: number): Promise<Eat | undefined> {
		const now_data = new Date(new Date().toLocaleDateString());
		const logCheck = await getRepository(Eat)
			.createQueryBuilder()
			.andWhere('alertId=:alertId', { alertId: alertId })
			.andWhere('eatDate= :now_data', {
				now_data: now_data,
			})
			.getOne();
		return logCheck;
	}

	async getAlertTimes(week: Week, userId: number) {
		const result = this.alertTimeRepository.find({
			week: week,
			userId: userId,
		});
		return result;
	}
	async dayTakingLog(userId: number, dayTakingLog: DayTakingLog) {
		const todaydata = await this.dayTakingLogRepository.findOne({
			date: new Date(new Date().toLocaleDateString()),
			userId: userId,
		});
		if (!todaydata) {
			await this.dayTakingLogRepository.save(dayTakingLog);
		}
		await this.dayTakingLogRepository.update(
			{
				date: new Date(new Date().toLocaleDateString()),
				userId: userId,
			},
			{ takeStatus: dayTakingLog.takeStatus },
		);
		return;
	}
	async getTodayJob(userId: number, nowDate: Date) {
		const now = await this.dayToweek(nowDate.getDay());
		const result = await this.alertTimeRepository.find({
			week: now,
			userId,
		});
		return result;
	}
	async dayToweek(day: number): Promise<Week> {
		let result: Week = Week.Sun;
		switch (day) {
			case 0:
				result = Week.Sun;
				break;
			case 1:
				result = Week.Mon;
				break;
			case 2:
				result = Week.Tue;
				break;
			case 3:
				result = Week.Wed;
				break;
			case 4:
				result = Week.Thu;
				break;
			case 5:
				result = Week.Fri;
				break;
			case 6:
				result = Week.Sat;
				break;
		}
		return result;
	}
}
