import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertModule } from './alert';

import { AllExceptionFilter } from './http-exception.filter.ts';
import { MessageQueueModule } from './message_queue';
import { PillManageModule } from './pill_manage/pill_manage.module';
import { PushModule } from './push';
import { AlertTime } from './repo/entity/alert-time.entity';
import { DayTakingLog } from './repo/entity/day-taking-log.entity';
import { Eat } from './repo/entity/eat.entity';
import { Job } from './repo/entity/job.entity';
import { User } from './repo/entity/user.entity';
import { RepositoryModule } from './repo/repo.module';
import { UserManageModule } from './user_manage';

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: process.env.DATABASE_HOST,
			port: 3306,
			username: process.env.DATABASE_USER,
			password: process.env.DATABASE_PASSWORD,
			database: process.env.DATABASE_NAME,
			entities: [Job, User, Eat, AlertTime, DayTakingLog],
			synchronize: true,
		}),
		BullModule.forRoot({
			redis: {
				host: process.env.REDIS_USER,
				port: 6379,
			},
		}),
		MessageQueueModule,
		RepositoryModule,
		PillManageModule,
		UserManageModule,
		AlertModule,
		PushModule,
		AllExceptionFilter,
	],
})
export class ApiModule {}
