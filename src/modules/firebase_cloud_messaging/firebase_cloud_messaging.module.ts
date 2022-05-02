import { Module } from '@nestjs/common';
import { FirebaseCloudMessagingController } from './firebase_cloud_messaging.controller';
import { FirebaseCloudMessagingService } from './firebase_cloud_messaging.service';

@Module({
	controllers: [FirebaseCloudMessagingController],
	providers: [FirebaseCloudMessagingService],
    exports:[FirebaseCloudMessagingService]
})
export class FirebaseCloudMessagingModule {}