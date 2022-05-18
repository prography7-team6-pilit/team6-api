import { RepositoryService } from '@modules/repo/repo.service';
import { Injectable } from '@nestjs/common';
import { EatRequestDto } from './dto/eat.request.post.dto';
import { Eat } from '@modules/repo/entity/eat.entity';

@Injectable()
export class PillManageService {
    constructor(private readonly repo:RepositoryService){}

    async getMonthPill(userId:number,year:number,month:number){
        const week:Date=await this.strTodate(year,month,1);
        const job=await this.repo.repo_getMonth(userId,week);
        console.log(job);
        return job;
    }

    async takePill(eatDto:EatRequestDto){
        const data:Eat={
            eatId:0,
            alertId:eatDto.alertId,
            eatDate:new Date(),
        }
        const result = await this.repo.repo_addPill(data);
        //return result;

        //Api dummy
        return {result:true}
    }

    async putPill(){
        return 0;
    }

    async deletePill(){
        return 0;
    }

    async strTodate(year:number,month:number,day:number){
        const strDate = year+'-'+month.toString().padStart(2,'0')+'-'+day.toString().padStart(2,'0');
        const dateDate = new Date(strDate);
        return dateDate;
    }
}
