import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
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
	path: 'alerts',
})
@ApiTags('알람 등록 API')
export class MessageQueueController {
    constructor(private msgq:MessageQueueService,
        private repo:RepositoryService){}
    
    @ApiBearerAuth('access-token')
    @ApiOperation({summary:'오늘의 알람 조회 (메인페이지,캘린더)'})
    @ApiCreatedResponse({description:"성공",type:JobResponseGetDto})
    @ApiQuery({name:'year',required:true,description:'년도',example:2022})
    @ApiQuery({name:'month',required:true,description:'월',example:5})
    @ApiQuery({name:'day',required:true,description:'일',example:9})
    @UseGuards(JwtAuthGuard)
	@Get('/')
	async getMsg(@Query('year') year:number,@Query('month') month:number,@Query('day') day:number,@Res() res:Response) {
        const userId=1;
        const result=await this.msgq.getMsg(userId);
        return res.json(result);
	}

    @ApiBearerAuth('access-token')
    @ApiOperation({summary:'특정 알람 조회 (수정페이지)'})
    @ApiCreatedResponse({description:"성공",type:JobResponseUnitGetDto})
    @ApiParam({name:'alertsId',required:true,example:'1'})
    @UseGuards(JwtAuthGuard)
	@Get('/:alertId')
	async getMsgUnit(@Param('alertId') id:Request,@Res() res:Response) {
        const userId=1;
        const result=await this.msgq.getMsg(userId);
        return res.json(result);
	}

    @ApiBearerAuth('access-token')
    @ApiOperation({summary:'알람 등록 (알람추가페이지)'})
    @ApiCreatedResponse({description:"성공",type:JobResponseDto})
    @ApiForbiddenResponse({description:"실패",type:JobResponseErrorDto})
    @UseGuards(JwtAuthGuard)
    @Post('/')
    async setMsg(@Req() req:Request, @Body(new ValidationPipe()) addJobDto:JobRequestPostDto, @Res() res:Response){
        const userId=1;
        const bullId:string=await this.msgq.addMsg(addJobDto);
        const saveJob=await this.repo.repo_saveJob(bullId,userId,addJobDto); //res.user 의 userId 가져오기
        const result:JobResponseDto={
            result:true,
            alertId:saveJob.alertId
        }
		return res.json(result);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({summary:'알람 수정 (수정페이지)'})
    @ApiCreatedResponse({description:"성공",type:JobResponseDto})
    @ApiForbiddenResponse({description:"실패",type:JobResponseErrorDto})
    @UseGuards(JwtAuthGuard)
    @Put('/:alertId')
    async changeMsg(@Req() req:Request,@Res() res:Response,@Param('alertId') id:number,@Body(new ValidationPipe()) addJobDto:JobRequestPostDto){
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
    @ApiParam({name:'alertId',required:true,example:'1'})
    @UseGuards(JwtAuthGuard)
    @Delete('/:alertId')
    async removeMsg(@Req() req:Request,@Param('alertId') id:number){
        const result = await this.msgq.delMsg(id);
        return 
    }
}