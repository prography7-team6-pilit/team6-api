import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseCloudMessagingModule } from './firebase_cloud_messaging';
import { MessageQueueModule } from './message_queue';
import { PillManageModule } from './pill_manage/pill_manage.module';
import { Eat } from './repo/entity/eat.entity';
import { Job } from './repo/entity/job.entity';
import { Pill } from './repo/entity/pill.entity';
import { User } from './repo/entity/user.entity';
import { RepositoryModule } from './repo/repo.module';
import { SampleModule } from './sample';
import { UserManageModule } from './user_manage';

@Module({
	imports: [
		ConfigModule.forRoot(),
		BullModule.forRoot({
			redis: {
				host: process.env.REDIS_USER,
				port: 6379,
			  },
		  }),
		  TypeOrmModule.forRoot({
			type: 'mysql',
			host: process.env.DATABASE_HOST,
			port: 3306,
			username: process.env.DATABASE_USER,
			password: process.env.DATABASE_PASSWORD,
			database: process.env.DATABASE_NAME,
			entities: [Job,User,Pill,Eat],
			synchronize: true,
		  }),
		  SampleModule,
		  MessageQueueModule,
		  FirebaseCloudMessagingModule,
		  RepositoryModule,
		  PillManageModule,
		  UserManageModule
		],
})
export class ApiModule {}