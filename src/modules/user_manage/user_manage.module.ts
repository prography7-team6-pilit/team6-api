import { RepositoryModule } from '@modules/repo';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './dto/jwt.strategy';
import { UserManageController } from './user_manage.controller';
import { UserManageService } from './user_manage.service';

@Module({
  imports:[
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.register({
      secret:"asdf",
      signOptions:{
        expiresIn:60*60,
      }
    }),
    RepositoryModule
  ],
  controllers: [UserManageController],
  providers: [UserManageService,JwtStrategy],
  exports: [UserManageService,PassportModule],
})
export class UserManageModule {}