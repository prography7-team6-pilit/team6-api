import { JobRequestPostDto } from '@modules/message_queue/dto/job.request.post.dto';
import { UserRequestDto } from '@modules/user_manage/dto/user.request.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, getConnection, Repository } from 'typeorm';
import { Eat } from './entity/eat.entity';
import { Job } from './entity/job.entity';
import { User } from './entity/user.entity';

@Injectable()
export class RepositoryService {
  constructor(
    @InjectRepository(Job) private jobRepository:Repository<Job>,
    @InjectRepository(User) private userRepository:Repository<User>,
    @InjectRepository(Eat) private eatRepository:Repository<Eat>,
    
  ){}

  async repo_saveJob(job:Job): Promise<Job> {
    const result=await this.jobRepository.save(job);
    return result;
  }

  async repo_getJob(week:string,id:number,date:Date): Promise<Job[]|undefined> {

    let query;
    if(week=="Mon"){query={where:{userId:id,Mon:true}};}
    if(week=="Tue"){query={where:{userId:id,Tue:true}};}
    if(week=="Wed"){query={where:{userId:id,Wed:true}};}
    if(week=="Thu"){query={where:{userId:id,Thu:true}};}
    if(week=="Fri"){query={where:{userId:id,Fri:true}};}
    if(week=="Sat"){query={where:{userId:id,Sat:true}};}
    if(week=="Sun"){query={where:{userId:id,Sun:true}};}
    //-----------------------------------
    const job=await this.jobRepository.find(query);
    const db=await getConnection();

    const from_date = date;
    const to_date = new Date(date.setDate(date.getDate() + 1));

    const jobLists= await db.getRepository(Job)
    .createQueryBuilder("job")
    .leftJoinAndMapMany('job.eatId', Eat, 'eat', 'eat.alertId = job.alertId')
    .where('eat.eatDate >= :from_date', {
      from_date: from_date,
    })
    .andWhere('eat.eatDate >= :to_date', {
      to_date: to_date,
    })
    .getMany();
    console.log(jobLists);
    db.close();

    return job;

  }

  async repo_getPut(id:number): Promise<Eat[]|undefined> {
    const job=await this.eatRepository.find({ alertId :id});
    return job;
  }

  async repo_getDel(id:number):Promise<DeleteResult>{
    const job=await this.jobRepository.delete({alertId:id});
    //repeat에 등록된 job만 죽이면 될듯?
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
    .where('eat.eatDate >= :from_date', {
      from_date: from_date,
    })
    .andWhere('eat.eatDate >= :to_date', {
      to_date: to_date,
    })
    .getMany();

    db.close();

  }
  async repo_addPill(eat:Eat){
    const result= await this.eatRepository.save(eat);
    return result;
  }
}
/*

1	마그네슘	같이먹으면 좋아요!
2	비타민C	이건 같이먹으면 좀 그런데 ..

*/