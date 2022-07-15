import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { JwtStrategy } from './dto/jwt.strategy';
import { UserController } from './user.controller';
import { userRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		ConfigModule.forRoot(),
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({
			secret: process.env.JWT,
			signOptions: {
				expiresIn: 60 * 60 * 24 * 30 * 12, //1년
			},
		}),
	],
	controllers: [UserController],
	providers: [UserService, JwtStrategy, userRepository],
	exports: [UserService, PassportModule],
})
export class UserModule {}
