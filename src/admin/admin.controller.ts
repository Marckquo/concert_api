import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { BearerGuard } from '../auth/bearer.guard';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @UseGuards(BearerGuard)
    @Get('is_admin')
    isAdmin(@Req() request): Promise<{
        isAdmin: boolean
    }> {
        const walletAddress = request.token;
        return this.adminService.isAdmin(walletAddress).then(isAdmin => {
            return {
                isAdmin
            };
        });
    }
}
