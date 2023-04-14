import { Module, forwardRef } from '@nestjs/common';
import { TezosService } from './tezos.service';
import { EventsGateway } from 'src/ws/events/events.gateway';
import { ShowModule } from 'src/show/show.module';
import { ShowService } from 'src/show/show.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from 'src/show/show.entity';
import { MetadataModule } from 'src/metadata/metadata.module';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [TypeOrmModule.forFeature([Show]), forwardRef(() => ShowModule), MetadataModule, AdminModule],
  providers: [TezosService, EventsGateway, ShowService],
  exports: [TezosService]
})
export class TezosModule {}
