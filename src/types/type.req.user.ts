import { JwtDto } from '@modules/user/dto/jwt.strategy.dto';

declare global {
	namespace Express {
		export interface User extends JwtDto {}
	}
}
