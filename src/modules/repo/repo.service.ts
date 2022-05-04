import { AddJob } from '@modules/message_queue/dto/addjob.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entity/job.entity';
import { User } from './entity/user.entity';

@Injectable()
export class RepositoryService {
  constructor(@InjectRepository(Job) private jobRepository:Repository<Job>,@InjectRepository(User) private userRepository:Repository<User>){}
  async repo_saveJob(addJob: AddJob): Promise<Job> {
    const job=new Job();
    job.jobTitle=addJob.jobTitle;
    job.jobDesc=addJob.jobDesc;
    job.jobTime=addJob.jobTime;
    job.jobWeek=addJob.jobWeek;
    job.isPush=addJob.isPush;
    const result=await this.jobRepository.save(job);
    return result;
  }

  async repo_savePill(addJob: AddJob): Promise<void> {

  }
}