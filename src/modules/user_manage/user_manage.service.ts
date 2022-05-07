import { RepositoryService } from '@modules/repo/repo.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRequestDto } from './dto/user.request.dto';

@Injectable()
export class UserManageService {
	constructor(private readonly jwtService:JwtService,
		private readonly repo:RepositoryService){}
		
	async signIn(uuid:string):Promise<string | undefined>{
		try{
			const result=await this.repo.getNickname(uuid);
			const payload={...result};
			const accessToken = this.jwtService.sign(payload);
			return accessToken;
		}
		catch{
			return undefined
		}
	}
	async signUp(userDto:UserRequestDto):Promise<string | undefined>{
		try{
			const result = await this.repo.setNickname(userDto);
			const payload={result};
			const accessToken = await this.jwtService.sign(payload);
			return accessToken;	
		}
		catch{
			return undefined
		}
	}
}