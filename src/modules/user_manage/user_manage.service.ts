import { User } from '@modules/repo/entity/user.entity';
import { RepositoryService } from '@modules/repo/repo.service';
import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRequestDto } from './dto/user.request.dto';

@Injectable()
export class UserManageService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly repo: RepositoryService,
	) {}

	async signIn(uuid: string) {
		const result = await this.repo.getNickname(uuid);
		if (!result) {
			return;
		}
		const payload = { ...result };
		const accessToken = this.jwtService.sign(payload);
		return accessToken;
	}
	async signUp(userDto: UserRequestDto): Promise<string> {
		const result = await this.repo.setNickname(
			userDto.uuid,
			userDto.nickname,
			userDto.firebasetoken,
		);
		const payload = { ...result };
		const accessToken = await this.jwtService.sign(payload);
		return accessToken;
	}
}
