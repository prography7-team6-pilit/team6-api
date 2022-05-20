import { AllExceptionFilter } from '@modules/http-exception.filter.ts';
import { Week } from '@modules/message_queue/dto/enums/week.enum';
import { Injectable, UseFilters } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { query } from 'express';
import { Brackets, DeleteResult, getConnection, Repository, UpdateResult } from 'typeorm';
import { Eat } from './entity/eat.entity';
import { Job } from './entity/job.entity';
import { User } from './entity/user.entity';

@UseFilters(AllExceptionFilter)
@Injectable()
export class RepositoryService {
  constructor(
    @InjectRepository(Job) private jobRepository:Repository<Job>,
    @InjectRepository(User) private userRepository:Repository<User>,
    @InjectRepository(Eat) private eatRepository:Repository<Eat>,
  ){}

  async repo_getJob(id:number,date:Date,strWeek:string) {
    const from_date = new Date(date).toISOString();
    const to_date = new Date(date.setDate(date.getDate() + 1)).toISOString();
    let weekQuery="job."+strWeek+" = true";
  
    const db=getConnection();
    const takeLogs= await db.getRepository(Job)
    .createQueryBuilder("job")
    .select('job.alertId,eat.eatId')
    .leftJoinAndMapMany('job.eatId', Eat, 'eat', 'eat.alertId = job.alertId')
    .where("job.userId= :userId",{userId:id})
    .andWhere(weekQuery)
    .andWhere(new Brackets(qb => {
      qb.where("eat.eatDate >= :from_date", { from_date: from_date })
        .andWhere("eat.eatDate < :to_date", { to_date: to_date })
    }))
    .andWhere("job.IsRemoved =:removed",{removed:false})
    .getRawMany();

    const weekJob=await db.getRepository(Job)
    .createQueryBuilder("job")
    .where("job.userId= :userId",{userId:id})
    .andWhere(weekQuery)
    .andWhere("job.IsRemoved =:removed",{removed:false})
    .getRawMany();


    return {weekJob,takeLogs};
  }

  async repo_saveJob(job:Job): Promise<Job> {
    const result=await this.jobRepository.save(job);
    return result;
  }

  async repo_putJob(alertId:number,job:Job) {
    const result=await getConnection()
    .createQueryBuilder()
    .update(Job)
    .set({
      alertId:alertId,
      alertTime: job.alertTime,
      isPush: job.isPush,
      userId: job.userId,
      bullId: job.bullId,
      pillName:job.pillName,
      Mon: job.Mon,Tue: job.Tue,Wed: job.Wed,Thu: job.Thu,Fri: job.Fri,Sat: job.Sat,Sun: job.Sun,
    })
    .where("alertId = :alertId", { alertId: alertId })
    .execute();
    return result;
  }

  async repo_delJob(alertId:number):Promise<DeleteResult>{
    const job=await getConnection().getRepository(Job)
    .createQueryBuilder("job")
    .update(Job)
    .set({ IsRemoved:true })
    .where("alertId = :alertId", { alertId: alertId })
    .execute();
    return job;
  }
  //--------------------------------------------------------------

  async getNickname(uuid:string):Promise<User | undefined>{
    const nickname=await this.userRepository.findOne({uuid:uuid});
    return nickname;
  }

  async setNickname(userEntity:User):Promise<User>{
    const result=await this.userRepository.save(userEntity);
    return result;
  }
  //--------------------------------------------------------------

  async repo_getMonth(userId:number,date:Date){
    const from_date = date;
    const to_date = new Date(date.setDate(date.getMonth() + 1));
    const db=await getConnection();
    const jobLists= await db.getRepository(Job)
    .createQueryBuilder("job")
    .leftJoinAndMapMany('job.eatId', Eat, 'eat', 'eat.alertId = job.alertId')
    .where("eatId=")
    .andWhere('eat.eatDate >= :from_date', {
      from_date: from_date,
    })
    .andWhere('eat.eatDate >= :to_date', {
      to_date: to_date,
    })
    .getMany();
  }
  async repo_addPill(eat:Eat){
    const result= await this.eatRepository.save(eat);
    return result;
  }
  async repo_putPill(eatId:number){
    const result=await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Eat)
    .where("eatId = :eatId", { eatId: eatId })
    .execute();
    return result;
  }

  async repo_isTaked(alertId:number){
    const now_data = new Date();
    const from_date = now_data;
    const to_date = new Date(now_data.setDate(now_data.getMonth() + 1));
    const db=getConnection();
    const logCheck= await db.getRepository(Eat)
    .createQueryBuilder("eat")
    .andWhere("eat.alertId=:alertId",{alertId:alertId})
    .andWhere('eat.eatDate >= :from_date', {
      from_date: from_date,
    })
    .andWhere('eat.eatDate >= :to_date', {
      to_date: to_date,
    })
    .getRawOne();
    return logCheck;
  }
}