import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
	const options = new DocumentBuilder()
		.setTitle('Server API Docs')
		.setVersion('0.0.1')
		.addBearerAuth({ type: 'http',name:'Access-token',description:'기기의 uid정보, 사용자 닉네임이 담긴 JWT',in:'Header', scheme: 'bearer', bearerFormat: 'Token' },'access-token',)
		.build();

	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('docs', app, document);
}
