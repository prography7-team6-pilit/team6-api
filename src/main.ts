import { Env } from '@config/env';
import { TransformResponseInterceptor } from '@core/interceptors';
import { setupSwagger } from '@core/setup';
import {
	RequestMethod,
	ValidationPipe,
	VERSION_NEUTRAL,
	VersioningType,
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
	app.useGlobalInterceptors(new TransformResponseInterceptor());
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
