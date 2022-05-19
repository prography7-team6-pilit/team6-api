import { Eat } from '@modules/repo/entity/eat.entity';
import { Job } from '@modules/repo/entity/job.entity';
import { RepositoryService } from '@modules/repo/repo.service';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bull';
import { Week } from './dto/enums/week.enum';
import { JobRequestPostDto } from './dto/job.request.post.dto';
import { JobResponseDto } from './dto/job.response.dto';
import { JobResponseGetDto } from './dto/job.response.get.dto';
import { JobResponseUnitGetDto } from './dto/job.response.get.unit.dto';


@Injectable()
export class MessageQueueService implements OnModuleDestroy{
    constructor(@InjectQueue('message') private msgq:Queue,private repo:RepositoryService){}

    async getMsg(year:number,month:number,day:number,userId:number):Promise<JobResponseGetDto|undefined>{ //작업목록 불러오기
        const week:Date=await this.strTodate(year,month,day);
        const strWeek=Week[week.getDay()];
        const job=await this.repo.repo_getJob(strWeek,userId,week);
        const result:JobResponseGetDto={
            alerts: []
        };
        job.forEach((data)=>{
            let arr=[];
            if(data.job_Mon==true){arr.push("Mon");}
            if(data.job_Tue==true){arr.push("Tue");}
            if(data.job_Wed==true){arr.push("Wed");}
            if(data.job_Thu==true){arr.push("Thu");}
            if(data.job_Fri==true){arr.push("Fri");}
            if(data.job_Sat==true){arr.push("Sat");}
            if(data.job_Sun==true){arr.push("Sun");}

            if(data.eat_eatId){data.eat_eatResult=true}else{data.eat_eatResult=false}

            const tmp:JobResponseUnitGetDto={
                alertId:data.job_alertId,
                alertTime:data.job_alertTime,
                alertWeek:arr,
                isPush:data.job_isPush,
                pillName:data.job_pillName,
                eatId:data.eat_eatId,
                eatResult:data.eat_eatResult
            }
            console.log(data);
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
            pillName:jobDto.pillName,
            Mon: false,Tue: false,Wed: false,Thu: false,Fri: false,Sat: false,Sun: false,eat:[],
            firebasetoken:firebasetoken,
            IsRemoved:false
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
    async putMsg(id:number):Promise<Eat[]|undefined>{
        const data = await this.repo.repo_getPut(id);
        return data;
    }

    async delMsg(id:number):Promise<JobResponseDto>{
        try{
            const data=await this.repo.repo_getDel(id);
            let apiData:JobResponseDto={
                result:true
            }
            if(data.affected!>0){
                apiData.result=true;
            }
            else{
                apiData.result=false;
            }
            return apiData;
        }
        catch{
            const result:JobResponseDto={
                result:true
            }
            return result;
        }
    }
    
    async onModuleDestroy() {
        await this.msgq.close();
    }

    async strTodate(year:number,month:number,day:number){
        const strDate = year+'-'+month.toString().padStart(2,'0')+'-'+day.toString().padStart(2,'0');
        const dateDate = new Date(strDate);
        return dateDate;
    }
}