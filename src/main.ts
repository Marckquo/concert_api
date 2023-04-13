import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MetadataService } from './metadata/metadata.service';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { WsAdapter } from '@nestjs/platform-ws';
import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import { IShow } from './show/show.interface';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useWebSocketAdapter(new WsAdapter(app));
    await app.listen(process.env.HTTP_PORT ?? 3000);
}

bootstrap();
