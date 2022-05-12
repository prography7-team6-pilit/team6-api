import { JobRequestPostDto } from '@modules/message_queue/dto/job.request.post.dto';
import { UserRequestDto } from '@modules/user_manage/dto/user.request.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
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

  async repo_getJob(id:number): Promise<Job[]|undefined> {
    const job=await this.jobRepository.find({ userId :id});
    return job;
  }

  async repo_getDel(id:number):Promise<DeleteResult>{
    const job=await this.jobRepository.delete({alertId:id});
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

  async repo_addPill(eat:Eat){
    const result= await this.eatRepository.save(eat);
    return result;
  }
}
/*

1	마그네슘	같이먹으면 좋아요!
2	비타민C	이건 같이먹으면 좀 그런데 ..

*/