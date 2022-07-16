import { Env } from '@config/env';
import { setupSwagger } from '@core/setup';
import {
	RequestMethod,
	ValidationPipe,
	VersioningType,
	VERSION_NEUTRAL,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { DefaultExceptionFilter } from './core/exception-filters';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('api', {
		exclude: [
			'docs',
			{
				method: RequestMethod.GET,
				path: 'health-check',
			},
		],
	});
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		}),
	);
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: VERSION_NEUTRAL,
	});
	app.useGlobalFilters(new DefaultExceptionFilter());

	setupSwagger(app);

	const configService: ConfigService<Env> = app.get(ConfigService);
	const port = configService.get<number>('PORT') || 3000;

	await app.listen(port, () => {
		console.log(`SERVER LISTENING ON port ${port}`);
	});
}
bootstrap();

function expressBasicAuth(arg0: {
	users: { pilit: string };
	challenge: boolean;
}): any {
	throw new Error('Function not implemented.');
}
