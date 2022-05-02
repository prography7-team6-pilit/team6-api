import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';

@Processor('message')
export class MessageQueueConsumer {
  @Process('transcode')
  handleTranscode(job: Job) {
    console.log("Start transcoding...");
    console.log(job.data);
    console.log('Transcoding completed');
  }
}

//https://docs.nestjs.com/techniques/queues

/*
1. 약추가 (추가 수정 삭제)
2. 약 리스트(월화수목금, 시간-type 지정)
3. 최초가입시(닉네임, uuid)-->API키 반환
- Firebase Push 통신 방법 알아보기(FCM)
*/
