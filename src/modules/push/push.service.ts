import { HttpService } from '@nestjs/axios';
import { ConsoleLogger, Injectable } from '@nestjs/common';

interface PushParams {
	firebaseToken: string;
	title: string;
	body: string;
}

@Injectable()
export class PushService {
	private logger = new ConsoleLogger();
	constructor(private http: HttpService) {}
	async push({ firebaseToken, title, body }: PushParams): Promise<void> {
		const payload = {
			notification: {
				title: title,
				body: body,
				icon: 'https://team6-api.prography.org/img/pilit.png',
			},
			data: {
				title: title,
				body: body,
				icon: 'https://team6-api.prography.org/img/pilit.png',
			},
			to: firebaseToken,
			priority: 'high',
		};
		this.logger.log('메세지전송', payload);
		console.log('메세지전송', payload);
		await this.sendFcmMessage(payload);
	}

	private async sendFcmMessage(fcmMessage: any) {
		const HOST = 'https://fcm.googleapis.com/fcm/send';
		const http = this.http;
		try {
			const url = HOST;
			const headersRequest = {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + process.env.FIREBASE_SERVER_KEY,
			};
			const response = await http
				.post(url, JSON.stringify(fcmMessage), {
					headers: headersRequest,
				})
				.toPromise();
			if (!response) {
				return false;
			}
			return await response!.data;
		} catch (err) {
			return { error: err };
		}
	}
}
