import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiService } from './api.service';
import { SampleModule } from './sample';

@Module({
	imports: [SampleModule,
		ScheduleModule.forRoot()],
		providers: [ApiService],

})
export class ApiModule {}
