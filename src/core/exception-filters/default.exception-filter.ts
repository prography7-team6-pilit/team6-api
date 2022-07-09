import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { ErrorInfo } from './error-info';

@Catch()
export class DefaultExceptionFilter implements ExceptionFilter {
	catch(exception: Error & Partial<ErrorInfo>, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = exception.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
		const code = exception.code ?? 'UNKNOWN';

		response.status(status).json({
			message: exception.message,
			code,
			status,
			timestamp: new Date().toISOString(),
		});
	}
}
