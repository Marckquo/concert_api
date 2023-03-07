import { Module } from '@nestjs/common';
import { TezosService } from './tezos.service';

@Module({
  providers: [TezosService]
})
export class TezosModule {}
