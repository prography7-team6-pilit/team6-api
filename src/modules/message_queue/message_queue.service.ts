import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class MessageQueueService {
    constructor(@InjectQueue('message') private msgq:Queue){}

    async addMsg(){
        const job=await this.msgq.add('transcode',{
            foo:'bar'
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

}