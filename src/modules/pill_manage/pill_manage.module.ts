import { AllExceptionFilter } from '@modules/http-exception.filter.ts';
import { RepositoryModule } from '@modules/repo';
import { UserManageModule } from '@modules/user_manage';
import { Module } from '@nestjs/common';
import { PillManageController } from './pill_manage.controller';
import { PillManageService } from './pill_manage.service';

@Module({
    imports:[RepositoryModule,UserManageModule,AllExceptionFilter],
    controllers: [PillManageController],
	providers: [PillManageService],
	exports: [PillManageService],
})
export class PillManageModule {}