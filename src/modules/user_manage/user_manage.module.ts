import { Module } from '@nestjs/common';
import { UserManageController } from './user_manage.controller';
import { UserManageService } from './user_manage.service';

@Module({
  controllers: [UserManageController],
  providers: [UserManageService],
  exports: [UserManageService],
})
export class UserManageModule {}