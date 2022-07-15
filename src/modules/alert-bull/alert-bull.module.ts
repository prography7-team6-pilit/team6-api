import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertTime } from 'src/entity/alert-time.entity';
import { Job } from 'src/entity/job.entity';
import { AlertBullService } from './alert-bull.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([AlertTime, Job]),
		BullModule.registerQueue({
			name: 'message',
		}),
	],
	providers: [AlertBullService],
	exports: [AlertBullService],
})
export class AlertBullModule {}
