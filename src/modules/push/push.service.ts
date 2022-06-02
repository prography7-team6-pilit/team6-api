import { FcmService } from '@doracoder/fcm-nestjs';
import { Injectable } from '@nestjs/common';

interface PushParams {
	firebaseToken: string;
	title: string;
	body: string;
}

@Injectable()
export class PushService {
	constructor(private fcmServcie: FcmService) {}

	async push({ firebaseToken, title, body }: PushParams): Promise<void> {
		console.log('firebaseToken, title, body', firebaseToken, title, body);
		// TODO: firebase 푸시 보내기
		const notification = {
			body: body,
			title: title,
			link: '',
		};
		const data = {
			body: body,
			title: title,
			link: '',
		};
		await this.fcmServcie.sendNotification(
			[firebaseToken],
			{ data: data, notification: notification },
			true,
		);
	}
}
