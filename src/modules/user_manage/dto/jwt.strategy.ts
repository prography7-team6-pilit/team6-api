import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { Strategy } from "passport-jwt";
import { UserManageService } from "../user_manage.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private usermanage:UserManageService){
        super({
            secretOrKey:process.env.JWT,
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }
    async validate(payload:any){
        if (!payload) {
          throw new UnauthorizedException();
        }
        return payload
    }
}