import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	await app.listen(3000);
}

bootstrap();
                Thanks for installing Nest 🙏
                                                                             Please consider donating to our open collective
                                                                                    to help us maintain this package.
                                                                                                    