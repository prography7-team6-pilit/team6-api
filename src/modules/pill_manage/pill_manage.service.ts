import { RepositoryService } from '@modules/repo/repo.service';
import { Injectable } from '@nestjs/common';
import { EatRequestDto } from './dto/eat.request.post.dto';
import { Eat } from '@modules/repo/entity/eat.entity';
import { JobResponsePostDto } from '@modules/message_queue/dto/job.response.post.dto';

@Injectable()
export class PillManageService {
    constructor(private readonly repo:RepositoryService){}

    async getMonthPill(userId:number,year:number,month:number){
        const week:Date=await this.strTodate(year,month,1);
        const job=await this.repo.repo_getMonth(userId,week);
        return job;
    }

    async takePill(requestDto:EatRequestDto):Promise<JobResponsePostDto|undefined>{
        try{
            const isTaked=await this.repo.repo_isTaked(requestDto.alertId);
            if(isTaked){
                const result = await this.repo.repo_putPill(isTaked.eat_eatId);
                if(result.affected!>0){
                    return {result:false}
                }else{
                    return {result:true}
                }
            }
            else{
                const data:Eat={
                    eatId:0,
                    alertId:requestDto.alertId,
                    eatDate:new Date(),
                }
                const result = await this.repo.repo_addPill(data);
                return {result:true}
            }
        }
        catch(err){
            return undefined;
        }
    }

    async strTodate(year:number,month:number,day:number){
        const strDate = year+'-'+month.toString().padStart(2,'0')+'-'+day.toString().padStart(2,'0');
        const dateDate = new Date(strDate);
        return dateDate;
    }
}
