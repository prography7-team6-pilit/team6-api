import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';


@Injectable()
export class ApiService {
  constructor(private scheduler:SchedulerRegistry){}

  @Cron('* * * * * *')
  triggerCronJob(){
    //1초 간격으로 코드 실행
  }
}
