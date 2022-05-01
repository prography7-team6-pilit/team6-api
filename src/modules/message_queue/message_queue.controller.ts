import { Controller, Get, Post } from '@nestjs/common';
import { MessageQueueService } from './message_queue.service';

@Controller({
	version: '1',
	path: 'msgq',
})
export class MessageQueueController {
    constructor(private readonly msgq:MessageQueueService){}
	@Get('/get')
	async getMsg() {
        console.log("get");
        const result=await this.msgq.getMsg()
        return result
	}
    @Post('/set')
    async setMsg(){
        const result=await this.msgq.addMsg()
		return `msgq ${result}`;
    }
}