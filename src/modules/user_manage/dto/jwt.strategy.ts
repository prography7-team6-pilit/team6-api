import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { Strategy } from "passport-jwt";
import { UserManageService } from "../user_manage.service";
import { JwtDto } from "./jwt.strategy.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private usermanage:UserManageService){
        super({
            secretOrKey:'asdf',
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