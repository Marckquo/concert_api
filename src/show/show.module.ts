import { Module, forwardRef } from '@nestjs/common';
import { ShowService } from './show.service';
import { ShowController } from './show.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from './show.entity';
import { MetadataModule } from '../metadata/metadata.module';
import { AuthModule } from '../auth/auth.module';
import { AdminModule } from '../admin/admin.module';
import { TezosModule } from '../tezos/tezos.module';
import { TezosService } from '../tezos/tezos.service';

@Module({
    imports: [TypeOrmModule.forFeature([Show]), forwardRef(() => TezosModule), MetadataModule, AuthModule, AdminModule],
    providers: [ShowService],
    controllers: [ShowController],
})
export class ShowModule { }
