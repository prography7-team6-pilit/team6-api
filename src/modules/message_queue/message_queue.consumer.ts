import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { AlertDto } from '../../core/types/alert-dto';
import { PushService } from '../push';

@Processor('message')
export class MessageQueueConsumer {
	constructor(private readonly pushService: PushService) {}

	@Process()
	async handleTranscode(job: Job<AlertDto>) {
		const { firebaseToken, pills } = job.data;
		const title = `약 먹을 시간입니다.`;
		let body = `복용해야할 약 목록은`;
		let count = 0;
		pills.forEach((element) => {
			if (count == 0) {
				body = `${body} ${element.name}`;
			} else {
				body = `${body},${element.name}`;
			}
		});
		body = `${body} 입니다`;
		// finished TODO: pills로 title, body 만들기
		await this.pushService.push({
			firebaseToken,
			title: title,
			body: body,
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
