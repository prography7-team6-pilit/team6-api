import { AlertBullModule } from '@modules/alert-bull';
import { PillModule } from '@modules/pill';
import { TakingLogModule } from '@modules/taking-log';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertTime } from 'src/entity/alert-time.entity';

import { PushModule } from '../push';
import { AlertConsumer } from './alert.consumer';
import { AlertController } from './alert.controller';
import { AlertRepository } from './alert.repository';
import { AlertService } from './alert.service';

@Module({
	imports: [
		PushModule,
		AlertBullModule,
		PillModule,
		TakingLogModule,
		TypeOrmModule.forFeature([AlertTime]),
	],
	controllers: [AlertController],
	providers: [AlertService, AlertConsumer, AlertRepository],
	exports: [AlertService, AlertRepository],
})
export class AlertModule {}
