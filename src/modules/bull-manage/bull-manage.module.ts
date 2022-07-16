import { AlertBullModule } from '@modules/alert-bull';
import { Module } from '@nestjs/common';
import { BullManageController } from './bull-manage.controller';

@Module({
	imports: [AlertBullModule],
	controllers: [BullManageController],
})
export class BullManageModule {}
