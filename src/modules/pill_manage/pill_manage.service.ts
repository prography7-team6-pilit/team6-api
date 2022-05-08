import { RepositoryService } from '@modules/repo/repo.service';
import { Injectable } from '@nestjs/common';
import { PillResponseErrorDto } from './dto/pill.error.dto';
import { EatRequestDto } from './dto/eat.request.post.dto';
import { PillResponseDto } from './dto/pill.response.dto';
import { Eat } from '@modules/repo/entity/eat.entity';

@Injectable()
export class PillManageService {
    constructor(private readonly repo:RepositoryService){}
    async getPill(name:string): Promise<PillResponseDto | PillResponseErrorDto> {
        const result = await this.repo.repo_getPill(name);
        if(result){
            const data:PillResponseDto={
                result:true,
                pillId:result.pillId,
                pillDesc:result.pillDesc,
                pillName:result.pillName,
            }
            return data;
        }
        else{
            const data:PillResponseErrorDto={
                result:false,
                error:"No name",
            }
            return data;
        }
	}

    async takePill(userId:number,eatDto:EatRequestDto){
        const data:Eat={
            eatId:0,
            userId:userId,
            jobId:eatDto.jobId,
            eatDate:new Date(),
        }
        const result = await this.repo.repo_addPill(data);
        return result;
    }

    async putPill(){
        return 0;
    }

    async deletePill(){
        return 0;
    }
}
