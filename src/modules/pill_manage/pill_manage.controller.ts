import { Body, Controller, Get, Post, Query, Res, UseFilters, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { EatRequestDto } from './dto/eat.request.post.dto';
import { PillManageService } from './pill_manage.service';
import { EatResponseDto } from './dto/eat.response.post.dto';
import { JwtAuthGuard } from '@modules/user_manage/user_manage.guard';
import { EatResponseMonthDto } from './dto/eat.response.month.dto';
import { EatResponseMonthUnitDto } from './dto/eat.response.month.unit.dto';
import { AllExceptionFilter } from '@modules/http-exception.filter.ts';

@UseFilters(AllExceptionFilter)
@Controller({
	version: '1',
	path: 'pills',
})
@ApiTags('약 관련 API')
export class PillManageController {
    constructor(private readonly pillService:PillManageService){}

    //Eat 기반으로 탐색
    @ApiBearerAuth('access-token')
    @ApiOperation({summary:'월별 섭취 정보(캘린더)',description:"state는 총 두가지로 표현되며 [ 미완료(0), 완료(1) ] 데이터가 없는 날은 날짜가 나오지 않습니다."})
    @ApiCreatedResponse({description:"성공",type:EatResponseMonthDto})//type 수정하기
    @UseGuards(JwtAuthGuard)
    @Get('/monthly')
    async monthPill(@Query('year') year:number,@Query('month') month:number,@Res() res:Response){
        const userId=1;
        //const result=await this.pillService.getMonthPill(userId,year,month);

        const apiDummy1:EatResponseMonthUnitDto={eatDate:"2022-05-01",pillState:0}
        const apiDummy2:EatResponseMonthUnitDto={eatDate:"2022-05-03",pillState:1,}
        const apiDummy3:EatResponseMonthUnitDto={eatDate:"2022-05-04",pillState:0,}
        const apiDummy4:EatResponseMonthUnitDto={eatDate:"2022-05-05",pillState:1,}
        const apiDummy5:EatResponseMonthUnitDto={eatDate:"2022-05-07",pillState:0,}
        const apiDummy6:EatResponseMonthUnitDto={eatDate:"2022-05-08",pillState:1,}
        const apiDummy7:EatResponseMonthUnitDto={eatDate:"2022-05-10",pillState:1,}
        const apiDummy8:EatResponseMonthUnitDto={eatDate:"2022-05-11",pillState:0,}
        const apiDummy9:EatResponseMonthUnitDto={eatDate:"2022-05-13",pillState:1,}
        const apiDummy10:EatResponseMonthUnitDto={eatDate:"2022-05-17",pillState:1,}
        const apiDummy11:EatResponseMonthUnitDto={eatDate:"2022-05-18",pillState:0,}
        const apiDummy12:EatResponseMonthUnitDto={eatDate:"2022-05-19",pillState:1,}
        const apiDummy13:EatResponseMonthUnitDto={eatDate:"2022-05-20",pillState:1,}
        const apiDummy15:EatResponseMonthUnitDto={eatDate:"2022-05-21",pillState:0,}
        const apiDummy16:EatResponseMonthUnitDto={eatDate:"2022-05-22",pillState:1,}
        const apiDummy17:EatResponseMonthUnitDto={eatDate:"2022-05-23",pillState:1,}
        const apiDummy18:EatResponseMonthUnitDto={eatDate:"2022-05-23",pillState:0,}
        const apiDummy19:EatResponseMonthUnitDto={eatDate:"2022-05-23",pillState:1,}

        const apiDummy:EatResponseMonthDto={takelogs:[apiDummy1,apiDummy2,apiDummy3,apiDummy4,apiDummy5,apiDummy6,
        apiDummy7,apiDummy8,apiDummy9,apiDummy10,apiDummy11,apiDummy12,apiDummy13,apiDummy15,apiDummy16,apiDummy17,
        apiDummy18,apiDummy19]}
        return res.json(apiDummy);
    }

    //대폭 수정필요. userId 없어도 가능.
    @ApiBearerAuth('access-token')
    @ApiOperation({summary:'약 복용 여부 구현완료'})
    @ApiCreatedResponse({description:"복용이 안되어있는데 True, 체크해제되면 False",type:EatResponseDto})
    @UseGuards(JwtAuthGuard)
    @Post('/taking-logs')
    async takenPill(@Body(new ValidationPipe()) addEatDto:EatRequestDto,@Res() res:Response){
        const result = await this.pillService.takePill(addEatDto);
        if(result){
            return res.json(result);
        }
        else{
            return res.status(400).json({error:'Wrong alertId'})
        }
        //Api dummy
        //return res.json({result:true})
    }
}