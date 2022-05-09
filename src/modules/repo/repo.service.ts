import { JobRequestPostDto } from '@modules/message_queue/dto/job.request.post.dto';
import { UserRequestDto } from '@modules/user_manage/dto/user.request.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Eat } from './entity/eat.entity';
import { Job } from './entity/job.entity';
import { Pill } from './entity/pill.entity';
import { User } from './entity/user.entity';

@Injectable()
export class RepositoryService {
  constructor(
    @InjectRepository(Job) private jobRepository:Repository<Job>,
    @InjectRepository(User) private userRepository:Repository<User>,
    @InjectRepository(Pill) private pillRepository:Repository<Pill>,
    @InjectRepository(Eat) private eatRepository:Repository<Eat>,
  ){}

  async repo_saveJob(bullId:string,userId:number,jobDto: JobRequestPostDto): Promise<Job> {
    //실패시 오류 처리해놓기.
    const job:Job={
      jobId: 0,
      jobTime: jobDto.jobTime,
      jobDesc: jobDto.jobDesc,
      jobTitle: jobDto.jobTitle,
      isPush: jobDto.isPush,
      pillId: jobDto.pillId,
      userId: userId,
      bullId: bullId,
      Mon: false,Tue: false,Wed: false,Thu: false,Fri: false,Sat: false,Sun: false,eat:[],

    };
    jobDto.jobWeek.forEach(element => {
      switch (element){
        case "Mon":job.Mon=true;break;
        case "Tue":job.Tue=true;break;
        case "Wed":job.Wed=true;break;
        case "Thu":job.Thu=true;break;
        case "Fri":job.Fri=true;break;
        case "Sat":job.Sat=true;break;
        case "Sun":job.Sun=true;break;
      }        
    });
    const result=await this.jobRepository.save(job);
    return result;
  }

  async repo_getJob(id:number): Promise<Job[]|undefined> {
    const job=await this.jobRepository.find({ userId :id});
    return job;
  }

  async repo_getDel(id:number):Promise<DeleteResult>{
    const job=await this.jobRepository.delete({jobId:id});
    return job;
  }
  //--------------------------------------------------------------

  async getNickname(uuid:string):Promise<User | undefined>{
    const nickname=await this.userRepository.findOne({uuid:uuid});
    return nickname;
  }
  async setNickname(userDto:UserRequestDto):Promise<User>{
    const userEntity:User={
      userId:0,
      uuid:userDto.uuid,
      nickname:userDto.nickname,
      job:[],
      eat:[]
    };
    const result=await this.userRepository.save(userEntity);
    return result;
  }
  //--------------------------------------------------------------

  async repo_getPill(name:string){
    const result= await this.pillRepository.findOne({pillName:name});
    return result;
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