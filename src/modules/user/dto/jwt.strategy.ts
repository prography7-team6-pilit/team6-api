import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private usermanage: UserService) {
		super({
			secretOrKey: process.env.JWT,
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		});
	}
	async validate(payload: any) {
		if (!payload) {
			throw new UnauthorizedException();
		}
		return payload;
	}
}
