import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertModule } from './alert';
import CatchException from './CatchException';

import { AlertTime } from '../entity/alert-time.entity';
import { DayTakingLog } from '../entity/day-taking-log.entity';
import { Eat } from '../entity/eat.entity';
import { Job } from '../entity/job.entity';
import { User } from '../entity/user.entity';
import { PillModule } from './pill/pill.module';
import { PushModule } from './push';
import { UserModule } from './user';

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
		AlertModule,
		PillModule,
		UserModule,
		PushModule,
		BullModule,
	],
	providers: [
		{
			provide: APP_FILTER,
			useClass: CatchException,
		},
	],
})
export class ApiModule {}
