import { forwardRef, Module } from '@nestjs/common';
import { BearerGuard } from './bearer.guard';
import { AdminGuard } from './admin.guard';
import { AdminModule } from '../admin/admin.module';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/admin/admin.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Admin]), forwardRef(() => AdminModule)],
    providers: [BearerGuard, AdminGuard, AuthService],
    exports: [BearerGuard, AdminGuard, AuthService],
})
export class AuthModule { }
