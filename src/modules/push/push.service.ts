import { Injectable } from '@nestjs/common';

interface PushParams {
	firebaseToken: string;
	title: string;
	body: string;
}

@Injectable()
export class PushService {
	async push({ firebaseToken, title, body }: PushParams): Promise<void> {
		console.log('firebaseToken, title, body', firebaseToken, title, body);
		// TODO: firebase 푸시 보내기
	}
}
