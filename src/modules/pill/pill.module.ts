import { AlertModule } from '@modules/alert';
import { TakingLogModule } from '@modules/taking-log';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DayTakingLog } from 'src/entity/day-taking-log.entity';
import { Job } from 'src/entity/job.entity';
import { PillController } from './pill.controller';
import { PillRepository } from './pill.repository';
import { PillService } from './pill.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Job, DayTakingLog]),
		TakingLogModule,
		forwardRef(() => AlertModule),
	],
	controllers: [PillController],
	providers: [PillService, PillRepository],
	exports: [PillService, PillRepository],
})
export class PillModule {}
