import { Module } from '@nestjs/common';
import { TezosService } from './tezos.service';
import { EventsGateway } from 'src/ws/events/events.gateway';

@Module({
  providers: [TezosService, EventsGateway],
  exports: [TezosService]
})
export class TezosModule {}
