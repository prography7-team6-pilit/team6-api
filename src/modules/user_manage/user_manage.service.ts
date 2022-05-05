import { Injectable } from '@nestjs/common';

@Injectable()
export class UserManageService {
    getSample(): string {
		return 'sample';
	}
}