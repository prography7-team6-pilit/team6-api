import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiService } from './api.service';
import { MessageQueueModule } from './message_queue/message_queue.module';
import { SampleModule } from './sample';

@Module({
	imports: [SampleModule,MessageQueueModule,
		ScheduleModule.forRoot()],
	providers: [ApiService],

})
export class ApiModule {}
