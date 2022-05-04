import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseCloudMessagingModule } from './firebase_cloud_messaging';
import { MessageQueueModule } from './message_queue';
import { PillManageModule } from './pill_manage/pill_manage.module';
import { Job } from './repo/entity/job.entity';
import { Pill } from './repo/entity/pill.entity';
import { User } from './repo/entity/user.entity';
import { RepositoryModule } from './repo/repo.module';
import { SampleModule } from './sample';

@Module({
	imports: [
		BullModule.forRoot({
			redis: {
				host: '127.0.0.1',
				port: 6379,
			  },
		  }),
		  TypeOrmModule.forRoot({
			type: 'mysql',
			host: '127.0.0.1',
			port: 3306,
			username: 'root',
			password: 'root',
			database: 'pillit',
			entities: [Job,User,Pill],
			synchronize: true,
		  }),
		  SampleModule,
		  MessageQueueModule,
		  FirebaseCloudMessagingModule,
		  RepositoryModule,
		  PillManageModule
		],
})
export class ApiModule {}