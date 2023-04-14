import { Module, forwardRef } from '@nestjs/common';
import { TezosService } from './tezos.service';
import { EventsGateway } from '../ws/events/events.gateway';
import { ShowModule } from '../show/show.module';
import { ShowService } from '../show/show.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from '../show/show.entity';
import { MetadataModule } from '../metadata/metadata.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [TypeOrmModule.forFeature([Show]), forwardRef(() => ShowModule), MetadataModule, AdminModule],
  providers: [TezosService, EventsGateway, ShowService],
  exports: [TezosService]
})
export class TezosModule {}
