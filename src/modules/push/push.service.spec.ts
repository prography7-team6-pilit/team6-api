import { PushService } from './push.service';

describe('PushService', () => {
	it('e2e', async () => {
		const pushService = new PushService();

		await pushService
			.push({
				firebaseToken: '',
				title: '테스트 제목',
				body: '테스트 내용',
			})
			.catch(console.error);
	});
});
