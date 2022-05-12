import { Job } from '@modules/repo/entity/job.entity';
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

    async addMsg(userId:number,firebasetoken:string,jobDto:JobRequestPostDto):Promise<Job>{ //작업 생성
        const job=await this.msgq.add('transcode',{
            jobDto            
        },
        {
            repeat: { cron: "*/1 * * * *" }
        });
        const bullId = job.id.toString();
        //reapeat : cron
        //시간을 입력받으면 입력받은 값을 cron 형태로 변경하여 진행하기.
        //실패시 오류 처리해놓기.
        const jobEntity:Job={
            alertId: 0,
            alertTime: jobDto.alertTime,
            isPush: jobDto.isPush,
            userId: userId,
            bullId: bullId,
            Mon: false,Tue: false,Wed: false,Thu: false,Fri: false,Sat: false,Sun: false,eat:[],
            firebasetoken:firebasetoken,
        };
        jobDto.alertWeek.forEach(element => {
            switch (element){
            case "Mon":jobEntity.Mon=true;break;
            case "Tue":jobEntity.Tue=true;break;
            case "Wed":jobEntity.Wed=true;break;
            case "Thu":jobEntity.Thu=true;break;
            case "Fri":jobEntity.Fri=true;break;
            case "Sat":jobEntity.Sat=true;break;
            case "Sun":jobEntity.Sun=true;break;
            }        
        });
        const saveJob=await this.repo.repo_saveJob(jobEntity); //res.user 의 userId 가져오기
        return saveJob;

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