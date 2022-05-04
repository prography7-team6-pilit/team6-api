import { Job } from '@modules/repo/entity/job.entity';
import { RepositoryService } from '@modules/repo/repo.service';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Bull, { Queue } from 'bull';
import { AddJob } from './dto/addjob.dto';

@Injectable()
export class MessageQueueService implements OnModuleDestroy{
    constructor(@InjectQueue('message') private msgq:Queue,
    private readonly repo:RepositoryService){}

    async addMsg(jobEntity:Job):Promise<Bull.JobId>{
        const job=await this.msgq.add('transcode',{
            jobEntity
        });
        console.log(job);
        return job.id;
        //reapeat : cron
        //시간을 입력받으면 입력받은 값을 cron 형태로 변경하여 진행하기.
    }
    
    async getMsg(){
        const job=await this.msgq.getWaiting()
        const jobCount=await this.msgq.getCompleted()
        console.log(jobCount)
        console.log(job);
        return job
    }

    async onModuleDestroy() {
        await this.msgq.close();
      }

}