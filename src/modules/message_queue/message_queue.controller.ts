import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
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
	

@Controller({
	version: '1',
	path: 'pill-alerts',
})
@ApiTags('알람 등록 API')
export class MessageQueueController {
    constructor(private msgq:MessageQueueService){}
    
    @ApiBearerAuth('access-token')
    @ApiOperation({summary:'오늘의 알람 조회 (메인페이지,캘린더) - req.user만 구현하면 완료'})
    @ApiCreatedResponse({description:"성공",type:JobResponseGetDto})
    @ApiQuery({name:'year',required:true,description:'년도',example:2022})
    @ApiQuery({name:'month',required:true,description:'월',example:5})
    @ApiQuery({name:'day',required:true,description:'일',example:9})
    @UseGuards(JwtAuthGuard)
	@Get('/')
	async getMsg(@Query('year') year:number,@Query('month') month:number,@Query('day') day:number,@Req() req:Request,@Res() res:Response) {
        const userId=1;
        //const result=await this.msgq.getMsg(year,month,day,userId);
        //console.log(result);
        //return res.json(result);
    
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
    @ApiOperation({summary:'알람 등록 (알람추가페이지)'})
    @ApiCreatedResponse({description:"성공",type:JobResponseDto})
    @ApiForbiddenResponse({description:"실패",type:JobResponseErrorDto})
    @UseGuards(JwtAuthGuard)
    @Post('/')
    async setMsg(@Req() req:Request, @Body(new ValidationPipe()) addJobDto:JobRequestPostDto, @Res() res:Response){
        const userId=1;
        const firebasetoken="token";

        const saveJob=await this.msgq.addMsg(userId,firebasetoken,addJobDto);
        const result:JobResponseDto={
            result:true
        }
		//return res.json(result);

        //API Dummuy
        const apiResult:JobResponseDto={
            result:true
        }
        return res.json(apiResult);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({summary:'알람 수정 (수정페이지)'})
    @ApiCreatedResponse({description:"성공",type:JobResponseDto})
    @ApiForbiddenResponse({description:"실패",type:JobResponseErrorDto})
    //@UseGuards(JwtAuthGuard)
    @Put('/:alertId')
    async changeMsg(@Req() req:Request,@Res() res:Response,@Param('alertId') id:number,@Body(new ValidationPipe()) addJobDto:JobRequestPostDto){
        const userId=1;
        const data = await this.msgq.putMsg(id);
        data!.forEach((element)=>{
            console.log(Week[element.eatDate.getDay()]);
        });
        //return data

        //API Dummuy
        const apiResult:JobResponseDto={
            result:true
        }
        return res.json(apiResult);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({summary:'알람 제거'})
    @ApiCreatedResponse({description:"성공",type:JobResponseDto})
    @ApiParam({name:'alertId',required:true,example:'1'})
    @UseGuards(JwtAuthGuard)
    @Delete('/:alertId')
    async removeMsg(@Req() req:Request,@Res() res:Response,@Param('alertId') id:number){
        const result = await this.msgq.delMsg(id);

        //API Dummuy
        const apiResult:JobResponseDto={
            result:true
        }
        return res.json(apiResult);
    }
}