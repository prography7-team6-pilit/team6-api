import { RepositoryService } from '@modules/repo/repo.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PillManageService {
    constructor(private readonly repo:RepositoryService){}
    getPill(): string {
		return 'pill';
	}
}
