import { HttpException, Injectable } from '@nestjs/common';
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
			throw new HttpException('회원 정보가 없습니다', 403);
		}
		const payload = { ...result };
		const accessToken = this.jwtService.sign(payload);
		return { accessToken, nickname: result.nickname };
	}
	async signUp(userDto: UserRequestDto) {
		const user = await this.userRepository.setNickname(
			userDto.uuid,
			userDto.nickname,
			userDto.firebasetoken,
		);
		const payload = { ...user };
		const accessToken = this.jwtService.sign(payload);
		return { accessToken, nickname: user.nickname };
	}
}
