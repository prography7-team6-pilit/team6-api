import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MessageQueueConsumer } from './message_queue.consumer';
import { MessageQueueController } from './message_queue.controller';
import { MessageQueueService } from './message_queue.service';

@Module({
	imports: [
		BullModule.registerQueue({
			name: 'message',
		}),
	],
	controllers: [MessageQueueController],
	providers: [MessageQueueService,MessageQueueConsumer],
    exports:[MessageQueueService]
})
export class MessageQueueModule {}