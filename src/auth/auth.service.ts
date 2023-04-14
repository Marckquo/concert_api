import { ForbiddenException, Injectable } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class AuthService {
    constructor(private adminService: AdminService) {}

    async canWriteShow(walletAddress: string, showId: string){
        const admin = await this.adminService.findOne(walletAddress);
        const correspondingShows = admin.shows.filter(show => show.id === showId);
        if (correspondingShows.length < 1){
            throw new ForbiddenException();
        }
    }
}
