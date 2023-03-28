import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BearerGuard } from './bearer.guard';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private readonly bearerGuard: BearerGuard,
        private readonly adminService: AdminService,
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        // First, check for a bearer token using the BearerGuard
        const hasBearerToken = this.bearerGuard.canActivate(context);

        if (!hasBearerToken) {
            return false;
        }

        const request = context.switchToHttp().getRequest();
        const walletAddress = request.token;

        // Check if the user is an admin
        return await this.adminService.isAdmin(walletAddress);
    }
}
