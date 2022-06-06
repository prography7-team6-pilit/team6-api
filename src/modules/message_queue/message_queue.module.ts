import { AlertModule } from '@modules/alert';
import { AllExceptionFilter } from '@modules/http-exception.filter.ts';
import { RepositoryModule } from '@modules/repo';
import { Module } from '@nestjs/common';

import { PushModule } from '../push';
import { MessageQueueConsumer } from './message_queue.consumer';
import { MessageQueueController } from './message_queue.controller';
import { MessageQueueService } from './message_queue.service';

@Module({
	imports: [RepositoryModule, AllExceptionFilter, PushModule, AlertModule],
	controllers: [MessageQueueController],
	providers: [MessageQueueService, MessageQueueConsumer],
	exports: [MessageQueueService],
})
export class MessageQueueModule {}
