import { Module } from '@nestjs/common';
import { ShowService } from './show.service';
import { ShowController } from './show.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from './show.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Show])],
    providers: [ShowService],
    controllers: [ShowController]
})
export class ShowModule { }
