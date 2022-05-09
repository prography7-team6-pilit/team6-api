import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JobResponseErrorDto } from './dto/job.error.dto';
import { JobRequestPostDto } from './dto/job.request.post.dto';
import { JobResponseDto } from './dto/job.response.dto';
import { JobResponseDeleteDto } from './dto/job.response.del.dto';
import { JobResponseGetDto } from './dto/job.response.get.dto';
import { MessageQueueService } from './message_queue.service';
import { RepositoryService } from '@modules/repo/repo.service';
import { JwtAuthGuard } from '@modules/user_manage/user_manage.guard';
import { JobResponseUnitGetDto } from './dto/job.response.get.unit.dto';


@Controller({
	version: '1',
	path: 'job',
})
@ApiTags('알람 등록 API')
export class MessageQueueController {
    constructor(private msgq:MessageQueueService,
        private repo:RepositoryService){}
    
    @ApiBearerAuth('access-token')
    @ApiOperation({summary:'오늘의 알람 조회 (메인페이지,캘린더)'})
    @ApiCreatedResponse({description:"성공",type:JobResponseGetDto})
    @UseGuards(JwtAuthGuard)
	@Get('/get/')
	async getMsg(@Res() res:Response) {
        const userId=1;
        const result=await this.msgq.getMsg(userId);
        return res.json(result);
	}

    @ApiBearerAuth('access-token')
    @ApiOperation({summary:'특정 알람 조회 (수정페이지)'})
    @ApiCreatedResponse({description:"성공",type:JobResponseUnitGetDto})
    @ApiParam({name:'jobId',required:true,example:'1'})
    @UseGuards(JwtAuthGuard)
	@Get('/get/:jobId')
	async getMsgUnit(@Param() id:Request,@Res() res:Response) {
        const userId=1;
        const result=await this.msgq.getMsg(userId);
        return res.json(result);
	}

    @ApiBearerAuth('access-token')
    @ApiOperation({summary:'알람 등록 (알람추가페이지)'})
    @ApiCreatedResponse({description:"성공",type:JobResponseDto})
    @ApiForbiddenResponse({description:"실패",type:JobResponseErrorDto})
    @UseGuards(JwtAuthGuard)
    @Post('/set')
    async setMsg(@Req() req:Request, @Body(new ValidationPipe()) addJobDto:JobRequestPostDto, @Res() res:Response){
        const userId=1;
        const bullId:string=await this.msgq.addMsg(addJobDto);
        const saveJob=await this.repo.repo_saveJob(bullId,userId,addJobDto); //res.user 의 userId 가져오기
        const result:JobResponseDto={
            result:true,
            jobId:saveJob.jobId
        }
		return res.json(result);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({summary:'알람 수정 (수정페이지)'})
    @ApiCreatedResponse({description:"성공",type:JobResponseDto})
    @ApiForbiddenResponse({description:"실패",type:JobResponseErrorDto})
    @UseGuards(JwtAuthGuard)
    @Put('/put/:jobId')
    async changeMsg(@Req() req:Request,@Res() res:Response,@Param('jobId') id:number,@Body(new ValidationPipe()) addJobDto:JobRequestPostDto){
        const userId=1;
        /*
        const bullId:string=await this.msgq.addMsg(addJobDto);
        const saveJob=await this.repo.repo_saveJob(bullId,userId,addJobDto); //res.user 의 userId 가져오기
        const result:JobResponseDto={
            result:true,
            jobId:saveJob.jobId
        }
		return res.json(result);
        */
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({summary:'알람 제거'})
    @ApiCreatedResponse({description:"성공",type:JobResponseDeleteDto})
    @ApiParam({name:'jobId',required:true,example:'1'})
    @UseGuards(JwtAuthGuard)
    @Delete('/del/:jobId')
    async removeMsg(@Req() req:Request,@Param('jobId') id:number){
        const result = await this.msgq.delMsg(id);
        return 
    }
}