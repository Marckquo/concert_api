import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MetadataService } from './metadata/metadata.service';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { WsAdapter } from '@nestjs/platform-ws';
import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';

async function bootstrap() {
    await createConcert(5, 30, 'tz1hZZPYpPTBZV3SVjGLnWQTcwAHHKGdZzD5');
    const app = await NestFactory.create(AppModule);
    app.useWebSocketAdapter(new WsAdapter(app));
    await app.listen(3000);
}

async function createConcert(capacity: number, ticketPrice: number, creatorAddress: string) {
    const Tezos = new TezosToolkit('https://ghostnet.tezos.marigold.dev/');
    Tezos.setProvider({
      signer: new InMemorySigner(process.env.PRIVATE_KEY),
    });
    const contract = await Tezos.contract.at('KT1JXEthzfrNSS4jfjdYbyp9WM5mYbBcZbVC');
    //1 mutez vaut 0.000001 tez.
    const operation = await contract.methods.createConcert(capacity, creatorAddress, ticketPrice).send({amount:2});
    await operation.confirmation(3);
    console.log('Concert créé avec succès!');
}

bootstrap();
