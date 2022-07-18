import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class userRepository {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
	) {}

	async getNickname(uuid: string) {
		return await this.userRepository.findOne({ uuid: uuid });
	}

	async setNickname(
		uuid: string,
		nickname: string,
		firebasetoken: string,
	): Promise<User> {
		const userEntity = this.userRepository.create({
			userId: this.randomNumber(),
			uuid,
			nickname,
			firebasetoken,
		});
		const checkDuplicateUUid = await this.userRepository.findOne({
			uuid: userEntity.uuid,
		});
		if (checkDuplicateUUid) {
			throw new HttpException('존재하는 UUID 입니다.', 403);
		}
		return await this.userRepository.save(userEntity);
	}
	private randomNumber(): number {
		let str = '';
		for (let i = 0; i < 8; i++) {
			str += Math.floor(Math.random() * 10);
		}
		return Number(str);
	}
}
