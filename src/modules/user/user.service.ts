import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRequestDto } from './dto/user.request.dto';
import { userRepository } from './user.repository';

@Injectable()
export class UserService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userRepository: userRepository,
	) {}

	async signIn(uuid: string) {
		const result = await this.userRepository.getNickname(uuid);
		if (!result) {
			return;
		}
		const payload = { ...result };
		const accessToken = this.jwtService.sign(payload);
		return accessToken;
	}
	async signUp(userDto: UserRequestDto): Promise<string> {
		const result = await this.userRepository.setNickname(
			userDto.uuid,
			userDto.nickname,
			userDto.firebasetoken,
		);
		const payload = { ...result };
		const accessToken = this.jwtService.sign(payload);
		return accessToken;
	}
}
