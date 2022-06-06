import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PushService } from './push.service';
@Module({
	imports: [HttpModule],
	providers: [PushService],
	exports: [PushService],
})
export class PushModule {}
