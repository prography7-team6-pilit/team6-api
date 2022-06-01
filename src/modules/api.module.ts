import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AllExceptionFilter } from './http-exception.filter.ts';
import { MessageQueueModule } from './message_queue';
import { PillManageModule } from './pill_manage/pill_manage.module';
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
			entities: [Job, User, Eat],
			synchronize: true,
		}),
		MessageQueueModule,
		RepositoryModule,
		PillManageModule,
		UserManageModule,
		AllExceptionFilter,
	],
})
export class ApiModule {}
