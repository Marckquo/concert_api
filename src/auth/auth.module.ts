import { forwardRef, Module } from '@nestjs/common';
import { BearerGuard } from './bearer.guard';
import { AdminGuard } from './admin.guard';
import { AdminModule } from '../admin/admin.module';

@Module({
    imports: [forwardRef(() => AdminModule)],
    providers: [BearerGuard, AdminGuard],
    exports: [BearerGuard, AdminGuard],
})
export class AuthModule { }
