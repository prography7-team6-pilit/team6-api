import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MessageQueueConsumer } from './message_queue.consumer';
import { MessageQueueController } from './message_queue.controller';
import { MessageQueueService } from './message_queue.service';
import { RepositoryModule } from '@modules/repo';
import { AllExceptionFilter } from '@modules/http-exception.filter.ts';


@Module({
	imports: [
		RepositoryModule,
		/*BullModule.registerQueue({
			name: 'message',
		}),*/
		AllExceptionFilter
	],
	controllers: [MessageQueueController],
	providers: [MessageQueueService,MessageQueueConsumer],
    exports:[MessageQueueService]
})
export class MessageQueueModule {}