import { BullModule } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { MessageQueueService } from './message_queue.service';

describe('MessageQueueService', () => {
  let service: MessageQueueService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports:[BullModule.registerQueue({
        name:"message",
      })],
      providers: [MessageQueueService],
    }).compile();

    service = module.get<MessageQueueService>(MessageQueueService);
  });
  afterEach(async ()=> {
      await module.close();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
