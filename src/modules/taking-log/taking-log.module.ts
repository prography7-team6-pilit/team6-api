import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Eat } from 'src/entity/eat.entity';
import { TakingLogRepository } from './taking-log.repository';

@Module({
	imports: [TypeOrmModule.forFeature([Eat])],
	providers: [TakingLogRepository],
	exports: [TakingLogRepository],
})
export class TakingLogModule {}
