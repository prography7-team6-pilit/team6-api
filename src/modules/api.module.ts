import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MessageQueueModule } from './message_queue/message_queue.module';
import { SampleModule } from './sample';

@Module({
	imports: [SampleModule,MessageQueueModule],
})
export class ApiModule {}
