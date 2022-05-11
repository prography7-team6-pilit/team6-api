import { RepositoryService } from '@modules/repo/repo.service';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bull';
import { JobRequestPostDto } from './dto/job.request.post.dto';
import { JobResponseDeleteDto } from './dto/job.response.del.dto';
import { JobResponseGetDto } from './dto/job.response.get.dto';
import { JobResponseUnitGetDto } from './dto/job.response.get.unit.dto';


@Injectable()
export class MessageQueueService implements OnModuleDestroy{
    constructor(@InjectQueue('message') private msgq:Queue,private repo:RepositoryService){}

    async getMsg(userId:number):Promise<JobResponseGetDto|undefined>{ //작업목록 불러오기
        const job=await this.repo.repo_getJob(userId);
        const result:JobResponseGetDto={
            alerts: []
        };
        job?.forEach((data)=>{
            let arr=[];
            if(data.Mon==true){arr.push("Mon");}
            if(data.Tue==true){arr.push("Tue");}
            if(data.Wed==true){arr.push("Wed");}
            if(data.Thu==true){arr.push("Thu");}
            if(data.Fri==true){arr.push("Fri");}
            if(data.Sat==true){arr.push("Sat");}
            if(data.Sun==true){arr.push("Sun");}

            const tmp:JobResponseUnitGetDto={
                alertId:data.alertId,
                alertTime: data.alertTime,
                alertWeek: arr,
                isPush: data.isPush,
                pillName:""
            }
            result.alerts.push(tmp);
        });
        return result;
    }

    async addMsg(jobDto:JobRequestPostDto):Promise<string>{ //작업 생성
        const job=await this.msgq.add('transcode',{
            jobDto            
        },
        {
            repeat: { cron: "*/1 * * * *" }
        });
        return job.id.toString();
        //reapeat : cron
        //시간을 입력받으면 입력받은 값을 cron 형태로 변경하여 진행하기.
    }
    async putMsg(){
        
    }

    async delMsg(id:number):Promise<JobResponseDeleteDto>{
        try{
            const data=await this.repo.repo_getDel(id);
            const result:JobResponseDeleteDto={
                result:true
            }
            if(data.affected!>0){
                result.result=true;
            }
            else{
                result.result=false;
            }
            return result;
        }
        catch{
            const result:JobResponseDeleteDto={
                result:true
            }
            return result;
        }
    }
    
    async onModuleDestroy() {
        await this.msgq.close();
    }
}