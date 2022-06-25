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

	async signIn(uuid: string): Promise<string> {
		const result = await this.repo.getNickname(uuid);
		if (result) {
			const payload = { ...result };
			const accessToken = this.jwtService.sign(payload);
			return accessToken;
		}
		throw new HttpException('잘못된 UUID입니다', 403);
	}
	async signUp(userDto: UserRequestDto): Promise<string> {
		const userEntity: User = {
			userId: 0,
			uuid: userDto.uuid,
			nickname: userDto.nickname,
			firebasetoken: userDto.firebasetoken,
		};
		const result = await this.repo.setNickname(userEntity);
		const payload = { ...result };
		const accessToken = await this.jwtService.sign(payload);
		return accessToken;
	}
}
