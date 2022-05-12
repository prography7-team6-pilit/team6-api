import { Body, Controller, Get, Post, Query, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { EatRequestDto } from './dto/eat.request.post.dto';
import { PillManageService } from './pill_manage.service';
import { EatResponseDto } from './dto/eat.response.post.dto';
import { JwtAuthGuard } from '@modules/user_manage/user_manage.guard';
import { EatResponseMonthDto } from './dto/eat.response.month.dto';

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
        return res.json();
    }

    //대폭 수정필요. userId 없어도 가능.
    @ApiBearerAuth('access-token')
    @ApiOperation({summary:'약 복용 여부'})
    @ApiCreatedResponse({description:"복용이 안되어있는데 True, 체크해제되면 False",type:EatResponseDto})
    @UseGuards(JwtAuthGuard)
    @Post('/taking-logs')
    async takenPill(@Body(new ValidationPipe()) addEatDto:EatRequestDto,@Res() res:Response){
        const userId=1;
        const result = await this.pillService.takePill(userId,addEatDto);
        return res.json(result);
    }
}