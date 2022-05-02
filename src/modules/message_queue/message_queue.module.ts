import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MessageQueueController } from './message_queue.controller';
import { MessageQueueService } from './message_queue.service';

@Module({
	imports: [
		BullModule.registerQueue({
			name: 'message',
			redis: {
			  host: '127.0.0.1',
			  port: 6379,
			},
		  })
	],
	controllers: [MessageQueueController],
	providers: [MessageQueueService,MessageQueueController],
    exports:[MessageQueueService]
})
export class MessageQueueModule {}