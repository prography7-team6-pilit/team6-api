import { RepositoryService } from '@modules/repo/repo.service';
import { Injectable } from '@nestjs/common';
import { EatRequestDto } from './dto/eat.request.post.dto';
import { Eat } from '@modules/repo/entity/eat.entity';

@Injectable()
export class PillManageService {
    constructor(private readonly repo:RepositoryService){}

    async takePill(userId:number,eatDto:EatRequestDto){
        const data:Eat={
            eatId:0,
            userId:userId,
            alertId:eatDto.alertId,
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
