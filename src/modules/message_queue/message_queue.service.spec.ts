import { BullModule } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { MessageQueueService } from './message_queue.service';

describe('MessageQueueService', () => {
  let service: MessageQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[BullModule.registerQueue({
        name:"message",
      })],
      providers: [MessageQueueService],
    }).compile();

    service = module.get<MessageQueueService>(MessageQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
