import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JobResponseErrorDto } from './dto/job.error.dto';
import { JobRequestPostDto } from './dto/job.request.post.dto';
import { JobResponseDto } from './dto/job.response.dto';
import { JobResponseGetDto } from './dto/job.response.get.dto';
import { MessageQueueService } from './message_queue.service';
import { JwtAuthGuard } from '@modules/user_manage/user_manage.guard';
import { Week } from './dto/enums/week.enum';
import { JobResponseUnitGetDto } from './dto/job.response.get.unit.dto';
import { AllExceptionFilter } from '@modules/http-exception.filter.ts';
import { JobRequestGetDto } from './dto/job.request.get.dto';
import { JobResponsePostDto } from './dto/job.response.post.dto';
import { JobRequestPutDto } from './dto/job.request.put.dto';
import { JobRequestDeleteDto } from './dto/job.request.delete.dto';
	
@UseFilters(AllExceptionFilter)
@Controller({
	version: '1',
	path: 'pill-alerts',
})
@ApiTags('알람 등록 API')
export class MessageQueueController {
    constructor(private msgq:MessageQueueService){}
    
    @ApiBearerAuth('access-token')
    @ApiOperation({summary:'오늘의 알람 조회 (메인페이지,캘린더) 구현 완료'})
    @ApiCreatedResponse({description:"성공",type:JobResponseGetDto})
    @UseGuards(JwtAuthGuard)
	@Get('/')
	async getAlert(@Query() requestData:JobRequestGetDto,@Req() req:Request,@Res() res:Response) {
        const userId=req.user!.userId;
        const result=await this.msgq.getPillAlert(requestData.year,requestData.month,requestData.day,userId);
        return res.json(result);
        
        //API Dummuy
        const apidummy1:JobResponseUnitGetDto={
            alertId:3,
            alertTime:"11:13",
            alertWeek:["Mon"],
            isPush:true,
            pillName:"솔가 마그네슘 비타민",
            eatId:1,
            eatResult:true
        }
        const apidummy2:JobResponseUnitGetDto={
            alertId:4,
            alertTime:"16:21",
            alertWeek:["Mon","Fri"],
            isPush:true,
            pillName:"에이치피오 덴프스",
            eatId:2,
            eatResult:false
        }
        const apidummy3:JobResponseUnitGetDto={
            alertId:5,
            alertTime:"20:11",
            alertWeek:["Mon","Thu"],
            isPush:true,
            pillName:"센트룸 종합비타민",
            eatId:3,
            eatResult:true
        }
        const apiResult:JobResponseGetDto={
            alerts:[apidummy1,apidummy2,apidummy3]
        }
        return res.json(apiResult);
	}

    @ApiBearerAuth('access-token')
    @ApiOperation({summary:'알람 등록 (알람추가페이지) 구현 완료'})
    @ApiCreatedResponse({description:"성공",type:JobResponseDto})
    @UseGuards(JwtAuthGuard)
    @Post('/')
    async postAlert(@Body(new ValidationPipe()) requestData:JobRequestPostDto,@Req() req:Request, @Res() res:Response){
        const userId=req.user!.userId;
        const firebasetoken=req.user!.firebasetoken;
        const saveJob=await this.msgq.postPillAlert(userId,firebasetoken,requestData);
        let result:JobResponsePostDto={result:false}
        if(saveJob){    
            result.result=true;
        }
		return res.json(result);

        //API Dummuy
        const apiResult:JobResponseDto={
            result:true
        }
        return res.json(apiResult);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({summary:'알람 수정 (수정페이지)'})
    @ApiCreatedResponse({description:"성공",type:JobResponseDto})
    @UseGuards(JwtAuthGuard)
    @Put('/:alertId')
    async putAlert(@Body(new ValidationPipe()) requestPostData:JobRequestPostDto, @Param() requestPutData:JobRequestPutDto,@Req() req:Request,@Res() res:Response){
        const userId=req.user!.userId;
        const firebasetoken=req.user!.firebasetoken;
        const data = await this.msgq.putPillAlert(userId,firebasetoken,requestPutData.alertId,requestPostData);
        let responseData={result:false}
        if(data.affected>0){responseData.result=true};
        return res.json(responseData);

        //API Dummuy
        const apiResult:JobResponseDto={
            result:true
        }
        return res.json(apiResult);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({summary:'알람 제거 구현완료'})
    @ApiCreatedResponse({description:"성공",type:JobResponseDto})
    @ApiParam({name:'alertId',required:true,example:'1'})
    @UseGuards(JwtAuthGuard)
    @Delete('/:alertId')
    async removeMsg(@Param() requestDeleteData:JobRequestDeleteDto,@Req() req:Request,@Res() res:Response){
        const result = await this.msgq.deletePillAlert(requestDeleteData.alertId);
        return res.json(result);
        //API Dummuy
        const apiResult:JobResponseDto={
            result:true
        }
        return res.json(apiResult);
    }
}