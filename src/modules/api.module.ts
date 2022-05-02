import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { FirebaseCloudMessagingModule } from './firebase_cloud_messaging';
import { MessageQueueModule } from './message_queue';
import { SampleModule } from './sample';

@Module({
	imports: [
		BullModule.forRoot({
			redis: {
				host: '127.0.0.1',
				port: 6379,
			  },
		  }),
		  SampleModule,MessageQueueModule,FirebaseCloudMessagingModule,
		],
})
export class ApiModule {}