import { Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseCloudMessagingService {
    async hello():Promise<string>{
        return "hello"
    }
}