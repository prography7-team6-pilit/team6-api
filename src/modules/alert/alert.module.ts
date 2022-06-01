import { AlertTime } from '@modules/repo/entity/alert-time.entity';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertService } from './alert.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([AlertTime]),
		BullModule.registerQueue({
			name: 'message',
		}),
	],
	providers: [AlertService],
})
export class AlertModule {}
