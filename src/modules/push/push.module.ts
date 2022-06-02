import { Module } from '@nestjs/common';
import { PushService } from './push.service';
import { FcmModule } from '@doracoder/fcm-nestjs';
import * as path from 'path';

@Module({
	imports: [
		FcmModule.forRoot({
			firebaseSpecsPath: path.join(
				__dirname,
				'../../../pillit_firebase_key.json',
			),
		}),
	],
	providers: [PushService],
	exports: [PushService],
})
export class PushModule {}
