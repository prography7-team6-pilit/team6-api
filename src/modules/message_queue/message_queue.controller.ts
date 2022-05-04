import { RepositoryService } from '@modules/repo/repo.service';
import { Body, Controller, Get, Post, Res, ValidationPipe } from '@nestjs/common';
import { ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { AddJob } from './dto/addjob.dto';
import { MessageQueueService } from './message_queue.service';

@Controller({
	version: '1',
	path: 'msgq',
})
export class MessageQueueController {
    constructor(private readonly msgq:MessageQueueService,
        private readonly repo:RepositoryService){}
    @ApiExtraModels(AddJob)
	@Get('/get')
	async getMsg() {
        console.log("get");
        const result=await this.msgq.getMsg()
        return result
	}
    @Post('/set')
    async setMsg(@Body(new ValidationPipe()) addJobDto:AddJob){
        const saveJob=await this.repo.repo_saveJob(addJobDto);
        const result=await this.msgq.addMsg(saveJob)
		return result;
    }
}