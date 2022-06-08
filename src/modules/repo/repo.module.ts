import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertTime } from './entity/alert-time.entity';
import { DayTakingLog } from './entity/day-taking-log.entity';
import { Eat } from './entity/eat.entity';
import { Job } from './entity/job.entity';
import { User } from './entity/user.entity';
import { RepositoryService } from './repo.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Eat, Job, User, AlertTime, DayTakingLog]),
	],
	providers: [RepositoryService],
	exports: [RepositoryService],
})
export class RepositoryModule {}
