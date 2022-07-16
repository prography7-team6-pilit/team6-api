import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { AlertDto } from '../../core/types/alert-dto';
import { PushService } from '../push';

@Processor('message')
export class AlertConsumer {
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
		console.log(body);
		await this.pushService.push({
			firebaseToken,
			title: title,
			body: body,
		});
	}
}
