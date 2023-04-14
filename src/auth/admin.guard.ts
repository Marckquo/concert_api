import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BearerGuard } from './bearer.guard';
import { AdminService } from '../admin/admin.service';
import { TezosService } from 'src/tezos/tezos.service';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private readonly bearerGuard: BearerGuard,
        private readonly adminService: AdminService,
        private readonly tezosService: TezosService
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
        const walletAddress = request.walletAddress;
        const publicKey = request.publicKey;
        const signature = request.signature;

        // Check if the user is an admin and verify the signature
        return await this.adminService.isAdmin(walletAddress) && await this.tezosService.verifySignature(signature, walletAddress, publicKey);
    }
}
