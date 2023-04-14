import { forwardRef, Module } from '@nestjs/common';
import { BearerGuard } from './bearer.guard';
import { AdminGuard } from './admin.guard';
import { AdminModule } from '../admin/admin.module';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../admin/admin.entity';
import { TezosModule } from '../tezos/tezos.module';

@Module({
    imports: [TypeOrmModule.forFeature([Admin]), forwardRef(() => AdminModule), forwardRef(() => TezosModule)],
    providers: [BearerGuard, AdminGuard, AuthService],
    exports: [BearerGuard, AdminGuard, AuthService],
})
export class AuthModule { }
