import { MessageQueueModule } from '@modules/message_queue';
import { AlertTime } from '@modules/repo/entity/alert-time.entity';
import { Job } from '@modules/repo/entity/job.entity';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertService } from './alert.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([AlertTime, Job]),
		BullModule.registerQueue({
			name: 'message',
		}),
	],
	providers: [AlertService],
	exports: [AlertService],
})
export class AlertModule {}
