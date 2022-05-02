import { Controller, Get, Post } from '@nestjs/common';
import { FirebaseCloudMessagingService } from './firebase_cloud_messaging.service';

@Controller({
	version: '1',
	path: 'fcm',
})
export class FirebaseCloudMessagingController {
    constructor(private readonly fmc:FirebaseCloudMessagingService){}
}