import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { AlertDto } from '../../core/types/alert-dto';
import { PushService } from '../push';

@Processor('message')
export class MessageQueueConsumer {
	constructor(private readonly pushService: PushService) {}

	@Process('transcode')
	async handleTranscode(job: Job<AlertDto>) {
		const { firebaseToken, pillNames } = job.data;
		console.log('pillNames', pillNames);

		// TODO: pillNames로 title, body 만들기
		await this.pushService.push({
			firebaseToken,
			title: '',
			body: '',
		});
	}
}

//https://docs.nestjs.com/techniques/queues

/*
1. 약추가 (추가 수정 삭제)
2. 약 리스트(월화수목금, 시간-type 지정)
3. 최초가입시(닉네임, uuid)-->API키 반환
- Firebase Push 통신 방법 알아보기(FCM)
*/
