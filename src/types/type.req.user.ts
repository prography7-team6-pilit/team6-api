import { JwtDto } from '@modules/user_manage/dto/jwt.strategy.dto';

declare global {
  namespace Express {
    export interface User extends JwtDto { }
  }
}