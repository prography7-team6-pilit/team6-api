import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Eat } from 'src/entity/eat.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class TakingLogRepository {
	constructor(@InjectRepository(Eat) private eatRepository: Repository<Eat>) {}

	async getTakeOrNot(
		userId: number,
		alertId: number,
		year: number,
		month: number,
		day: number,
	) {
		return await this.eatRepository.findOne({
			userId: userId,
			alertId: alertId,
			eatDate: `${year}-${month}-${day}`,
		});
	}

	async getTakeOrNotByDay(userId: number, onlyDate: Date): Promise<Eat[]> {
		return await this.eatRepository.find({
			userId: userId,
			eatDate: onlyDate,
		});
	}
	async addPill(eat: Eat) {
		return await this.eatRepository.save(eat);
	}

	async putPill(eatId: number): Promise<DeleteResult> {
		return await this.eatRepository.delete({ eatId });
	}

	async isTaked(alertId: number): Promise<Eat | undefined> {
		const now_data = new Date(new Date().toLocaleDateString());
		return await this.eatRepository.findOne({ alertId, eatDate: now_data });
	}
}
