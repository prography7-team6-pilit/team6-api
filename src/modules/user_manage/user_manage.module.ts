import { RepositoryModule } from '@modules/repo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './dto/jwt.strategy';
import { UserManageController } from './user_manage.controller';
import { UserManageService } from './user_manage.service';

@Module({
	imports: [
		ConfigModule.forRoot(),
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({
			secret: process.env.JWT,
			signOptions: {
				expiresIn: 60000000000 * 600000000000,
			},
		}),
		RepositoryModule,
	],
	controllers: [UserManageController],
	providers: [UserManageService, JwtStrategy],
	exports: [UserManageService, PassportModule],
})
export class UserManageModule {}
