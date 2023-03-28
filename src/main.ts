import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MetadataService } from './metadata/metadata.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
}
bootstrap();
