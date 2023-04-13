import { Module } from '@nestjs/common';
import { ShowService } from './show.service';
import { ShowController } from './show.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from './show.entity';
import { MetadataModule } from '../metadata/metadata.module';
import { AuthModule } from '../auth/auth.module';
import { AdminModule } from '../admin/admin.module';
import { TezosModule } from 'src/tezos/tezos.module';

@Module({
    imports: [TypeOrmModule.forFeature([Show]), MetadataModule, AuthModule, AdminModule, TezosModule],
    providers: [ShowService],
    controllers: [ShowController]
})
export class ShowModule { }
